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

export const getTeams = async (req: AuthRequest, res: Response) => {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { id: 'desc' } // Traz os mais novos primeiro
    });
    return res.json(teams);
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao buscar times' });
  }
};

// Editar o nome do time
export const updateTeam = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  
  try {
    await prisma.team.update({
      where: { id: Number(id) },
      data: { name }
    });
    return res.json({ message: 'Time atualizado com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao editar time' });
  }
};

// Excluir o time
export const deleteTeam = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const teamId = Number(id);

  try {
    // PROTEÇÃO: Verifica se existem tarefas atreladas a este time
    const tasksCount = await prisma.task.count({
      where: { team_id: teamId }
    });

    if (tasksCount > 0) {
      return res.status(400).json({ 
        error: `Não é possível excluir. Este time possui ${tasksCount} tarefa(s) vinculada(s). Exclua as tarefas primeiro.` 
      });
    }

    // Limpa a tabela auxiliar de membros do time antes de deletar o time
    await prisma.teamMember.deleteMany({
      where: { team_id: teamId }
    });

    // Exclui o time
    await prisma.team.delete({
      where: { id: teamId }
    });

    return res.json({ message: 'Time excluído com sucesso!' });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao excluir time' });
  }
};