import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getCompetitors, addCompetitor, deleteCompetitor } from '../controllers/competitorController.js';

const router = Router();
router.use(protect);
router.get('/', getCompetitors);
router.post('/', addCompetitor);
router.delete('/:id', deleteCompetitor);

export default router;
