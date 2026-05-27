import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getLeads, createLead, updateLead, deleteLead } from '../controllers/leadController.js';

const router = Router();
router.use(protect);
router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
