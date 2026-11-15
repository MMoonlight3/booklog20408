import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import { testDatabaseConnection } from './config/db.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Booklog API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: '요청한 API를 찾을 수 없습니다.' });
});

// 마지막 오류 처리 미들웨어
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
  }
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ message: '존재하지 않는 회원 정보입니다.' });
  }
  return res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
});

app.listen(PORT, async () => {
  console.log(`📚 Booklog 서버 실행: http://localhost:${PORT}`);
  await testDatabaseConnection();
});
