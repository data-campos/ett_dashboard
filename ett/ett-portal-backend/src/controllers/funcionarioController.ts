// src/controllers/funcionariosController.ts
import { Request, Response, NextFunction } from 'express';
import sql from '../config/sqlServerConfig';

export const getFuncionarios = async (req: Request, res: Response, next: NextFunction) => {
  const codColigada = req.params.codColigada;
  try {
    const result = await sql.query`
      SELECT *
      FROM ZPWPortalCliente
      WHERE CODCOLIGADA = ${codColigada}
    `;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).json({ message: 'Erro ao buscar funcionários' });
  }
};
