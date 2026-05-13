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

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = Number(id);

  try {
    // 1. Verifica se o usuário realmente pertence ao Admin logado
    const user = await prisma.user.findFirst({
      where: { id: userId, adminId: req.user!.id }
    });

    if (!user) {
      return res.status(403).json({ error: 'Usuário não encontrado ou sem permissão.' });
    }

    // 2. Remove o usuário de todos os times que ele participava
    await prisma.teamMember.deleteMany({
      where: { user_id: userId }
    });

    // 3. Retira o nome dele das tarefas (deixa a tarefa como "Sem atribuição")
    await prisma.task.updateMany({
      where: { assigned_to: userId },
      data: { assigned_to: null }
    });

    // 4. Limpa o histórico de edições que ele possa ter feito
    await prisma.taskHistory.deleteMany({
      where: { changed_by: userId }
    });

    // 5. Agora sim, com tudo limpo, o banco permite excluir o usuário!
    await prisma.user.delete({
      where: { id: userId }
    });

    return res.json({ message: 'Usuário excluído com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Erro de integridade ao excluir.' });
  }
};