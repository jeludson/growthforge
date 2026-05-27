import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  generateReport,
  getReports,
  getReport,
  getLatestReport,
  downloadPDF,
  rescanWebsite,
} from '../controllers/reportController.js';

const router = Router();
router.use(protect);
router.post('/generate', generateReport);
router.post('/rescan', rescanWebsite);
router.get('/', getReports);
router.get('/latest', getLatestReport);
router.get('/:id', getReport);
router.get('/:id/pdf', downloadPDF);

export default router;
