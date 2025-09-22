import { Router } from 'express';
import controller from '@/modules/auth/controller';

const router = Router();

router.post('/send-otp-for-verification', controller.sendOTPForVerification);

export default router;