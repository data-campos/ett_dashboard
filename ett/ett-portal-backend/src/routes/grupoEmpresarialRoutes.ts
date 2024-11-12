// src/routes/grupoEmpresarialRoutes.ts

import { Router } from 'express';
import { criarGrupoEmpresarial, listarGruposEmpresariais, atualizarStatusGrupo } from '../controllers/grupoEmpresarialController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Rota para criar um grupo empresarial
router.post('/grupo-empresarial', asyncHandler(criarGrupoEmpresarial));

// Rota para listar grupos empresariais
router.get('/grupo-empresarial', asyncHandler(listarGruposEmpresariais));

// Rota para atualizar o status do grupo empresarial
router.put('/grupo-empresarial/:id/status', asyncHandler(atualizarStatusGrupo));

export default router;
