import { z } from 'zod';

// Validação rigorosa dos dados de entrada usando Zod
export const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(['admin', 'member']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});