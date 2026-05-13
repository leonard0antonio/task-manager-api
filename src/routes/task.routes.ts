import { Router } from 'express';
import { createTask, updateTaskStatus, listTasks, deleteTask } from '../controllers/task.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Middleware global para este arquivo: todas as rotas abaixo exigem token
router.use(authenticate); 

router.post('/', authorizeAdmin, createTask); // Só admin cria tarefa
router.get('/', listTasks);                   // Todos listam (a controller filtra quem vê o que)
router.patch('/:id/status', updateTaskStatus); // Qualquer usuário logado pode mudar o status
router.delete('/:id', authorizeAdmin, deleteTask); // Apenas admin pode apagar a tarefa

export default router;