import { Router } from 'express';
import { createTask, updateTaskStatus, listTasks, deleteTask } from '../controllers/task.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate); // Todas as rotas abaixo exigem token

router.post('/', createTask);
router.patch('/:id/status', updateTaskStatus);

// Novas rotas:
router.get('/', listTasks);
router.delete('/:id', deleteTask);

router.patch('/:id/status', authenticate, updateTaskStatus); // Qualquer usuário logado pode mudar o status
router.delete('/:id', authenticate, authorizeAdmin, deleteTask); // Apenas admin pode apagar a tarefa

export default router;