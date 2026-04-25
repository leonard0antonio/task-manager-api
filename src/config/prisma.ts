import { PrismaClient } from '@prisma/client';

// Instância única do Prisma para evitar conexões excedentes no banco
export const prisma = new PrismaClient();