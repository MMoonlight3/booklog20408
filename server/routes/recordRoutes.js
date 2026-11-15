import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getJoinedRecords,
  getRecordById,
  updateRecord
} from '../controllers/recordController.js';

const router = Router();

// 공개 조회 메뉴
router.get('/', getAllRecords);
router.get('/joined', getJoinedRecords);
router.get('/:id', getRecordById);

// 로그인한 사용자만 등록·수정·삭제 가능
router.post('/', authenticateToken, createRecord);
router.put('/:id', authenticateToken, updateRecord);
router.delete('/:id', authenticateToken, deleteRecord);

export default router;
