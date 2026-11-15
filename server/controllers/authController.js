import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다.');
  }
  return jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export async function register(req, res, next) {
  try {
    const userName = String(req.body.user_name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!userName || userName.length > 30) {
      return res.status(400).json({ message: '이름은 1~30자로 입력해 주세요.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
      return res.status(400).json({ message: '올바른 이메일 주소를 입력해 주세요.' });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({ message: '비밀번호는 8~72자로 입력해 주세요.' });
    }

    const [existing] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: '이미 가입된 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)',
      [userName, email, hashedPassword]
    );

    const user = {
      user_id: result.insertId,
      user_name: userName,
      email
    };

    return res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      token: createToken(user.user_id),
      user
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해 주세요.' });
    }

    const [rows] = await pool.execute(
      'SELECT user_id, user_name, email, password FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const foundUser = rows[0];
    const passwordMatches = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const user = {
      user_id: foundUser.user_id,
      user_name: foundUser.user_name,
      email: foundUser.email
    };

    return res.json({
      message: '로그인되었습니다.',
      token: createToken(user.user_id),
      user
    });
  } catch (error) {
    return next(error);
  }
}

export function logout(_req, res) {
  // JWT는 서버 세션에 저장하지 않으므로 클라이언트가 토큰을 삭제합니다.
  return res.json({ message: '로그아웃되었습니다.' });
}
