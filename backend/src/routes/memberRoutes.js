import { Router } from 'express';
import { sanitizeBody } from '../middleware/sanitize.js';
import { getMembers, createMember, addMiles, deleteMember } from '../controllers/memberController.js';

const router = Router();

router.get('/', getMembers);
router.post('/', sanitizeBody, createMember);
router.patch('/:id/miles', sanitizeBody, addMiles);
router.delete('/:id', deleteMember);

export default router;
