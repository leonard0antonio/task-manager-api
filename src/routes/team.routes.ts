import { Router } from 'express';
import { createTeam, getTeams } from '../controllers/team.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Só passa se tiver token e for admin
router.post('/', authenticate, authorizeAdmin, createTeam);
router.get('/', authenticate, authorizeAdmin, getTeams);

export default router;