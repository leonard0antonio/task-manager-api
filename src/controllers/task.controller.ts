import { Response } from 'express';
import { TaskService } from '../services/task.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../config/prisma'; // <-- Adicione esta linha!

const taskService = new TaskService();

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    // Controller atua como intermediário: pega do body e manda pro Service
    const task = await taskService.createTask(req.body, req.user!.id);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await taskService.updateTaskStatus(Number(id), status, req.user!.id);
    res.json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { id, role } = req.user!;

    if (role === 'admin') {
      // Admin: Busca todas as tarefas
      const tasks = await prisma.task.findMany({
        include: { team: true, assignee: true }
      });
      return res.json(tasks);
    } else {
      // Member: Busca apenas tarefas dos times que ele faz parte
      const userTeams = await prisma.teamMember.findMany({
        where: { user_id: id },
        select: { team_id: true }
      });
      
      const teamIds = userTeams.map(ut => ut.team_id);

      const tasks = await prisma.task.findMany({
        where: { team_id: { in: teamIds } },
        include: { team: true, assignee: true }
      });
      return res.json(tasks);
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem deletar tarefas.' });
    }

    // Deleta o histórico primeiro para não quebrar a chave estrangeira (Integridade Relacional)
    await prisma.taskHistory.deleteMany({ where: { task_id: Number(id) } });
    await prisma.task.delete({ where: { id: Number(id) } });

    return res.status(204).send();
  } catch (error: any) {
    return res.status(400).json({ error: 'Erro ao deletar tarefa.' });
  }
};