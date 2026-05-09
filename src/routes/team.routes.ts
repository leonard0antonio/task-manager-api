import { Router } from 'express';
import { createTeam } from '../controllers/team.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Só passa se tiver token e for admin
router.post('/', authenticate, authorizeAdmin, createTeam);

export default router;