// src/controllers/dashboardController.ts

import { Request, Response } from 'express';
import sql from '../config/sqlServerConfig';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const result = await sql.query(`
      SELECT 
        CODCOLIGADA,
        COUNT(*) AS totalFuncionarios,
        AVG(VALOR) AS mediaSalario,
        SUM(CASE WHEN SEXO = 'M' THEN 1 ELSE 0 END) AS totalMasculino,
        SUM(CASE WHEN SEXO = 'F' THEN 1 ELSE 0 END) AS totalFeminino
      FROM dbo.ZPWPortalCliente
      GROUP BY CODCOLIGADA
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
  }
};
