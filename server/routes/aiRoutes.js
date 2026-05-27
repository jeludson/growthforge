import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { sendMessage, getMessages } from '../controllers/aiController.js';

const router = Router();
router.use(protect);
router.post('/chat', sendMessage);
router.get('/messages', getMessages);

export default router;
