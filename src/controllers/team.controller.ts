import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'O nome do time é obrigatório' });
    }

    const team = await prisma.team.create({
      data: { name },
    });

    return res.status(201).json(team);
  } catch (error: any) {
    return res.status(400).json({ error: 'Erro ao criar time' });
  }
};