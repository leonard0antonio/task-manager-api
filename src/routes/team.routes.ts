import { Router } from 'express';
import { createTeam, getTeams, updateTeam, deleteTeam } from '../controllers/team.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, authorizeAdmin, createTeam);
router.get('/', authenticate, authorizeAdmin, getTeams);

// NOVAS ROTAS AQUI:
router.patch('/:id', authenticate, authorizeAdmin, updateTeam);
router.delete('/:id', authenticate, authorizeAdmin, deleteTeam);

export default router;