import pool from '../config/db.js';

export async function getMyProfile(req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT user_id, user_name, email, created_at FROM users WHERE user_id = ? LIMIT 1',
      [req.user.user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '회원 정보를 찾을 수 없습니다.' });
    }
    return res.json({ user: rows[0] });
  } catch (error) {
    return next(error);
  }
}

export async function updateMyProfile(req, res, next) {
  try {
    const userName = String(req.body.user_name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!userName || userName.length > 30) {
      return res.status(400).json({ message: '이름은 1~30자로 입력해 주세요.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
      return res.status(400).json({ message: '올바른 이메일 주소를 입력해 주세요.' });
    }

    await pool.execute(
      'UPDATE users SET user_name = ?, email = ? WHERE user_id = ?',
      [userName, email, req.user.user_id]
    );

    const [rows] = await pool.execute(
      'SELECT user_id, user_name, email, created_at FROM users WHERE user_id = ? LIMIT 1',
      [req.user.user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '회원 정보를 찾을 수 없습니다.' });
    }
    return res.json({ message: '회원 정보가 수정되었습니다.', user: rows[0] });
  } catch (error) {
    return next(error);
  }
}

export async function deleteMyAccount(req, res, next) {
  try {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE user_id = ?',
      [req.user.user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '회원 정보를 찾을 수 없습니다.' });
    }

    // users.user_id를 참조하는 독서 기록은 ON DELETE CASCADE로 함께 삭제됩니다.
    return res.json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (error) {
    return next(error);
  }
}
