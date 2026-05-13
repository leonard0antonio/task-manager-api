import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import bcrypt from 'bcryptjs';

// 1. LISTAR USUÁRIOS
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        adminId: req.user!.id // Só traz os usuários que este Admin criou
      },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' }
    });
    return res.json(users);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao buscar seus usuários' });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'member',
        adminId: req.user!.id // A MÁGICA ACONTECE AQUI: Carimba o ID do Admin!
      }
    });

    return res.status(201).json({ message: 'Usuário criado', userId: newUser.id });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao criar usuário. Email já existe?' });
  }
};

// 2. EDITAR USUÁRIO (A função que estava faltando!)
export const updateUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  
  try {
    await prisma.user.updateMany({
      where: { 
        id: Number(id), 
        adminId: req.user!.id // Garante que o Admin só edita os PRÓPRIOS usuários
      }, 
      data: { name, email }
    });
    return res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) { 
    return res.status(400).json({ error: 'Erro ao editar usuário' }); 
  }
};

// 3. EXCLUIR USUÁRIO
export const deleteUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = Number(id);

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId, adminId: req.user!.id }
    });

    if (!user) {
      return res.status(403).json({ error: 'Usuário não encontrado ou sem permissão.' });
    }

    // Limpa dependências para não dar erro de chave estrangeira
    await prisma.teamMember.deleteMany({ where: { user_id: userId } });
    await prisma.task.updateMany({ where: { assigned_to: userId }, data: { assigned_to: null } });
    await prisma.taskHistory.deleteMany({ where: { changed_by: userId } });

    // Exclui o usuário
    await prisma.user.delete({ where: { id: userId } });

    return res.json({ message: 'Usuário excluído com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro de integridade ao excluir.' });
  }
};