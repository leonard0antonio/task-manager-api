import { Router } from 'express';
import { getUsers } from '../controllers/user.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, authorizeAdmin, getUsers);

export default router;