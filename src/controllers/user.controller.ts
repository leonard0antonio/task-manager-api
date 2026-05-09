import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    // Busca os usuários, mas NÃO traz a senha por segurança
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
      orderBy: { name: 'asc' } // Ordem alfabética
    });
    return res.json(users);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao buscar usuários' });
  }
};