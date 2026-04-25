import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Valida os dados usando o Zod
    const data = registerSchema.parse(req.body);

    // 2. Verifica se o e-mail já existe
    const userExists = await prisma.user.findUnique({ where: { email: data.email } });
    if (userExists) {
      return res.status(400).json({ error: 'E-mail já está em uso.' });
    }

    // 3. Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4. Salva no banco de dados
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'member',
      },
    });

    return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Erro ao registrar usuário.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    // 1. Busca o usuário
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 2. Compara a senha digitada com o hash do banco
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 3. Gera o Token JWT contendo o ID e a Role do usuário
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1d' }
    );

    return res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Erro ao fazer login.' });
  }
};