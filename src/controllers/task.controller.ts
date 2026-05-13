import { Response } from 'express';
import { TaskService } from '../services/task.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../config/prisma';

const taskService = new TaskService();

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.createTask(req.body, req.user!.id);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'pending', 'in_progress', ou 'completed'

  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { status }
    });
    return res.json(task);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao atualizar status da tarefa' });
  }
};

export const listTasks = async (req: AuthRequest, res: Response) => {
  try {
    // CORREÇÃO: Tiramos o adminId daqui. O TypeScript agora fica feliz!
    const { id, role } = req.user!;

    // REGRA PARA ADMINISTRADOR: Só vê tarefas que ELE CRIOU
    if (role === 'admin') {
      const tasks = await prisma.task.findMany({
        where: { 
          adminId: id // O filtro mestre de isolamento usa o próprio 'id' do Admin logado
        },
        include: { 
          team: true, 
          assignee: true 
        },
        orderBy: { created_at: 'desc' }
      });
      return res.json(tasks);
    } 
    
    // REGRA PARA MEMBRO: Só vê tarefas atribuídas a ele ou do time dele
    else {
      // 1. Descobrimos os times que esse membro participa
      const userTeams = await prisma.teamMember.findMany({
        where: { user_id: id },
        select: { team_id: true }
      });
      
      const teamIds = userTeams.map(ut => ut.team_id);

      const tasks = await prisma.task.findMany({
        where: {
          OR: [
            { assigned_to: id },         // Tarefas diretas para ele
            { team_id: { in: teamIds } } // Tarefas do time dele
          ]
        },
        include: { 
          team: true, 
          assignee: true 
        },
        orderBy: { created_at: 'desc' }
      });
      return res.json(tasks);
    }
  } catch (error: any) {
    console.error('Erro ao listar tarefas:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar suas tarefas.' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem deletar tarefas.' });
    }

    // 1. Busca a tarefa ANTES de deletar para checar a propriedade
    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    // 2. Trava Multi-Tenant: O Admin logado é o verdadeiro dono dessa tarefa?
    if (task.adminId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar uma tarefa de outro administrador.' });
    }

    // 3. Deleta o histórico primeiro para manter a Integridade Relacional
    await prisma.taskHistory.deleteMany({ where: { task_id: Number(id) } });
    await prisma.task.delete({ where: { id: Number(id) } });

    return res.status(204).send();
  } catch (error: any) {
    return res.status(400).json({ error: 'Erro ao deletar tarefa.' });
  }
};

// Edita todos os dados da Tarefa
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority, team_id, assigned_to } = req.body;

    // Garante que a tarefa pertence ao Admin logado
    const task = await prisma.task.findFirst({
      where: { id: Number(id), adminId: req.user!.id }
    });

    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada.' });

    await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        priority,
        team_id: Number(team_id),
        assigned_to: assigned_to ? Number(assigned_to) : null
      }
    });

    return res.json({ message: 'Tarefa atualizada com sucesso!' });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao atualizar tarefa.' });
  }
};