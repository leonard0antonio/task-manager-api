import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes'; // Importado!

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes); // Ativado!

export default app;