import { Router } from 'express';
// Adicione o createUser na importação
import { getUsers, updateUser, deleteUser, createUser } from '../controllers/user.controller'; 
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, authorizeAdmin, getUsers);
router.patch('/:id', authenticate, authorizeAdmin, updateUser); 
router.delete('/:id', authenticate, authorizeAdmin, deleteUser); 

// A NOVA ROTA EXCLUSIVA DO ADMIN:
router.post('/', authenticate, authorizeAdmin, createUser);

export default router;