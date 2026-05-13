import { Router } from 'express';
// Certifique-se de que a função deleteUser está sendo importada!
import { getUsers, updateUser, deleteUser } from '../controllers/user.controller'; 
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de gerenciamento de usuários são exclusivas do Admin
router.get('/', authenticate, authorizeAdmin, getUsers);
router.patch('/:id', authenticate, authorizeAdmin, updateUser); 

// A ROTA QUE VAI RESOLVER O SEU ERRO 404 ESTÁ AQUI:
router.delete('/:id', authenticate, authorizeAdmin, deleteUser); 

export default router;