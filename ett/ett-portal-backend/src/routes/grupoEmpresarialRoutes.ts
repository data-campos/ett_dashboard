// src/routes/grupoEmpresarialRoutes.ts

import { Router } from 'express';
import { 
  criarGrupoEmpresarial, 
  listarGruposEmpresariais, 
  associarEmpresasAoGrupo, 
  atualizarStatusGrupo,
  listarEmpresasAssociadas
} from '../controllers/grupoEmpresarialController';
import { asyncHandler } from '../utils/asyncHandler'; // Importe o asyncHandler

const router = Router();

router.post('/grupo-empresarial', asyncHandler(criarGrupoEmpresarial));
router.get('/grupo-empresarial', asyncHandler(listarGruposEmpresariais));
//router.post('/grupo-empresarial/associar', asyncHandler(associarEmpresaAoGrupo));
router.put('/grupo-empresarial/:id/status', asyncHandler(atualizarStatusGrupo));
router.post('/grupo-empresarial/associar-multiplos', asyncHandler(associarEmpresasAoGrupo));
router.get('/grupo-empresarial/:grupoEmpresarialId/partners', asyncHandler(listarEmpresasAssociadas));


export default router;
