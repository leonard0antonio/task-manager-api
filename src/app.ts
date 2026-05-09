import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes'; 
import teamRoutes from './routes/team.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes); // Ativado!

app.use('/api/teams', teamRoutes);

export default app;