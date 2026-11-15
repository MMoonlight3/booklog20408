import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: '로그인이 필요한 기능입니다.' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: '서버의 JWT_SECRET 설정을 확인해 주세요.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { user_id: Number(decoded.user_id) };
    return next();
  } catch {
    return res.status(401).json({ message: '로그인 정보가 만료되었거나 올바르지 않습니다.' });
  }
}
