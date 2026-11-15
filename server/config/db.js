import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVariables = requiredVariables.filter((key) => !process.env[key]);

if (missingVariables.length > 0) {
  console.warn(`환경변수 확인 필요: ${missingVariables.join(', ')}`);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'booklog_20408',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  dateStrings: true
});

export async function testDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    console.log('✅ MySQL 데이터베이스 연결 성공!');
    return true;
  } catch (error) {
    console.error('❌ MySQL 데이터베이스 연결 실패:', error.message);
    return false;
  } finally {
    connection?.release();
  }
}

export default pool;
