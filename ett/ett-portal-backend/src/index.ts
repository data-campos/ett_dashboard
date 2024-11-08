// src/index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRoutes from './routes/authRoutes';
import funcionarioRoutes from './routes/funcionarioRoutes';
import { connectToSqlServer } from './config/sqlServerConfig';
import dashboardRoutes from './routes/dashboardRoutes';
import partnerRoutes from './routes/partnerRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', funcionarioRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', partnerRoutes);

const PORT = process.env.PORT || 5000;

// Conexão com MySQL e SQL Server
AppDataSource.initialize()
  .then(async () => {
    console.log('Conectado ao MySQL');
    await connectToSqlServer(); // Conecta ao SQL Server
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => console.log('Erro ao conectar ao MySQL:', error));
