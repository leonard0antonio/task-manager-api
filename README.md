# 🚀 Task Manager API

Uma API robusta para Gerenciamento de Tarefas desenvolvida com **Node.js**, **TypeScript** e **Prisma**. O sistema permite a criação de contas, autenticação segura via JWT, gestão de equipas e controlo de tarefas com diferentes níveis de acesso (Admin e Membro).

---

## 🛠 Tecnologias Utilizadas

- **Runtime:** [Node.js](https://nodejs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Framework Web:** [Express.js](https://expressjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Autenticação:** [JWT (JSON Web Token)](https://jwt.io/) & [BcryptJS](https://github.com/dcodeIO/bcrypt.js)
- **Validação:** [Zod](https://zod.dev/)
- **Testes:** [Jest](https://jestjs.io/)
- **Containerização:** [Docker](https://www.docker.com/)
- **Deploy:** [Render](https://render.com/)

---

## 📋 Funcionalidades

### Autenticação e Autorização
- Registro de usuários e login com geração de Token JWT.
- Níveis de acesso: **Admin** (gestão total) e **Member** (gestão de tarefas atribuídas).

### Gerenciamento de Equipas
- Apenas Administradores podem criar e editar equipas.
- Vinculação de membros a equipas específicas.

### Tarefas
- CRUD completo de tarefas.
- Classificação por **Status** (Pendente, Em Progresso, Concluído).
- Classificação por **Prioridade** (Alta, Média, Baixa).
- Histórico automático de alterações de status.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado.
- Docker e Docker Compose (opcional, para o banco de dados).

### 1. Clonar o Repositório
```bash
git clone [https://github.com/teu-usuario/task-manager-api.git](https://github.com/teu-usuario/task-manager-api.git)
cd task-manager-api
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um ficheiro `.env` na raiz do projeto seguindo o exemplo:
```env
DATABASE_URL="postgresql://admin:adminpassword@localhost:5433/taskmanager?schema=public"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3000
```

### 4. Subir o Banco de Dados (Docker)
```bash
docker-compose up -d
```

### 5. Sincronizar o Banco com Prisma
```bash
npx prisma db push
```

### 6. Executar o Servidor
```bash
npm run dev
```

---

## 🧪 Testes Automatizados
O projeto utiliza **Jest** para garantir a qualidade do código.
```bash
npm test
```

---

## 📡 API Endpoints (Exemplos)

### Auth
- `POST /api/auth/register` - Criar nova conta.
- `POST /api/auth/login` - Autenticar usuário.

### Teams
- `POST /api/teams` - Criar equipa (Admin).
- `POST /api/teams/:id/members` - Adicionar membro ao time (Admin).

### Tasks
- `GET /api/tasks` - Listar tarefas (conforme nível de acesso).
- `POST /api/tasks` - Criar nova tarefa.
- `PATCH /api/tasks/:id/status` - Atualizar status da tarefa.
- `DELETE /api/tasks/:id` - Remover tarefa (Admin).

---

## 👨‍💻 Autor

Desenvolvido por **Leonardo Antonio** *Estudante de Análise e Desenvolvimento de Sistemas | Full Stack Developer*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/leonardo-a-a063b519b/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/leonard0antonio)

*Este projeto foi desenvolvido como parte de um desafio técnico para consolidar conhecimentos em Backend, APIs RESTful e Testes.*
