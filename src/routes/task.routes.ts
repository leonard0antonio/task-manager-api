import { Router } from 'express';
import { createTask, updateTaskStatus, listTasks, deleteTask } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate); // Todas as rotas abaixo exigem token

router.post('/', createTask);
router.patch('/:id/status', updateTaskStatus);

// Novas rotas:
router.get('/', listTasks);
router.delete('/:id', deleteTask);

export default router;