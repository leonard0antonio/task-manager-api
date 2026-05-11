import { TaskService } from "../src/services/task.service";
import { prisma } from "../src/config/prisma";

// 1. Simula (Mock) o Prisma Client para não tocar no banco de dados real
jest.mock('../src/config/prisma', () => ({
  prisma: {
    task: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),     
    },
    taskHistory: {
      create: jest.fn(),
    },
    $transaction: jest.fn(), // <-- Adicionado
  }
}));

describe("TaskService - Testes Unitários", () => {
  let taskService: TaskService;

  // Antes de cada teste, limpa os mocks e instancia o serviço
  beforeEach(() => {
    jest.clearAllMocks();
    taskService = new TaskService();
  });

  it("deve criar uma nova tarefa com sucesso", async () => {
    // Arrange (Preparação)
    const taskData = {
      title: "Tarefa de Teste",
      description: "Descrição do teste",
      priority: "high" as const,
      team_id: 1,
    };
    const userId = 1;

    const mockResponse = {
      id: 1,
      ...taskData,
      status: "pending",
      assigned_to: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Dizemos ao nosso "banco falso" o que ele deve retornar quando a função create for chamada
    (prisma.task.create as jest.Mock).mockResolvedValue(mockResponse);

    // Act (Ação)
    const result = await taskService.createTask(taskData, userId);

    // Assert (Verificação)
    expect(prisma.task.create).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty("id", 1);
    expect(result.title).toBe("Tarefa de Teste");
    expect(result.status).toBe("pending");
  });
  it("deve atualizar o status da tarefa e registrar no histórico", async () => {
    // Arrange (Preparação)
    const taskId = 1;
    const userId = 2;
    const newStatus = "in_progress" as const;

    const mockTask = { id: taskId, status: "pending" };

    // Simula a busca da tarefa (ela existe no banco falso)
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

    // Simula a transação do Prisma (retornando a tarefa atualizada e o histórico criado)
    (prisma.$transaction as jest.Mock).mockResolvedValue([
      { ...mockTask, status: newStatus },
      {
        id: 1,
        task_id: taskId,
        changed_by: userId,
        old_status: "pending",
        new_status: newStatus,
      },
    ]);

    // Act (Ação)
    const result = await taskService.updateTaskStatus(
      taskId,
      newStatus,
      userId,
    );

    // Assert (Verificação)
    expect(prisma.task.findUnique).toHaveBeenCalledWith({
      where: { id: taskId },
    });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);

    // Como a transação retorna um array, o resultado do nosso service será esse array
    expect(result[0].status).toBe(newStatus);
  });
});
