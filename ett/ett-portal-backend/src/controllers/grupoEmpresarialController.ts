// src/controllers/grupoEmpresarialController.ts

import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { GrupoEmpresarial } from '../models/GrupoEmpresarial';
import { ControleAcessoParceiro } from '../models/ControleAcessoParceiro';

export const criarGrupoEmpresarial = async (req: Request, res: Response) => {
  try {
    const { nome, descricao } = req.body;

    const grupo = new GrupoEmpresarial();
    grupo.nome = nome;
    grupo.descricao = descricao;

    await AppDataSource.manager.save(grupo);
    res.status(201).json({ message: 'Grupo empresarial criado com sucesso', grupo });
  } catch (error) {
    console.error('Erro ao criar grupo empresarial:', error);
    res.status(500).json({ message: 'Erro ao criar grupo empresarial' });
  }
};

export const listarGruposEmpresariais = async (req: Request, res: Response) => {
  try {
    const grupos = await AppDataSource.getRepository(GrupoEmpresarial).find({ relations: ['parceiros'] });
    res.status(200).json(grupos);
  } catch (error) {
    console.error('Erro ao listar grupos empresariais:', error);
    res.status(500).json({ message: 'Erro ao listar grupos empresariais' });
  }
};

export const atualizarStatusGrupo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status_acesso } = req.body;

    const grupo = await AppDataSource.getRepository(GrupoEmpresarial).findOne({ where: { id: parseInt(id) }, relations: ['parceiros'] });
    if (!grupo) {
      return res.status(404).json({ message: 'Grupo empresarial não encontrado' });
    }

    // Atualiza o status de todos os parceiros do grupo
    const parceiroRepository = AppDataSource.getRepository(ControleAcessoParceiro);
    grupo.parceiros.forEach(async parceiro => {
      parceiro.status_acesso = status_acesso;
      await parceiroRepository.save(parceiro);
    });

    res.status(200).json({ message: 'Status do grupo empresarial atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status do grupo empresarial:', error);
    res.status(500).json({ message: 'Erro ao atualizar status do grupo empresarial' });
  }
};
