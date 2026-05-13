import { prisma } from '../config/prisma';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class TaskService {
  // Cria uma nova tarefa. Se um usuário for atribuído, já vincula.
  async createTask(data: { title: string; description?: string; priority: TaskPriority; team_id: number; assigned_to?: number }, userId: number) {
    return prisma.task.create({
      data: {
        ...data,
        adminId: userId // <-- A MÁGICA DO ISOLAMENTO ACONTECE AQUI! O carimbo do dono.
      }
    });
  }

  // Atualiza a tarefa e registra o histórico se o status mudar
  async updateTaskStatus(taskId: number, newStatus: TaskStatus, userId: number) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new Error("Tarefa não encontrada");

    // Usa transação para garantir que a tarefa e o histórico sejam salvos juntos
    return prisma.$transaction([
      prisma.task.update({
        where: { id: taskId },
        data: { status: newStatus }
      }),
      prisma.taskHistory.create({
        data: {
          task_id: taskId,
          changed_by: userId,
          old_status: task.status,
          new_status: newStatus
        }
      })
    ]);
  }
}