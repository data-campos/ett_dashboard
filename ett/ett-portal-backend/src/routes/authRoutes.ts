import { Router } from 'express';
import { requestCode, verifyCode } from '../controllers/authController';

const router = Router();

router.post('/request-code', requestCode);
router.post('/verify-code', verifyCode);

export default router;
