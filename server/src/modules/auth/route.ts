import { Router } from 'express';
import controller from '@/modules/auth/controller';

const router = Router();

router.post('/send-otp-for-verification', controller.sendOTPForVerification);
router.post('/verify-otp-for-verification', controller.verifyOTPForVerification);
router.post('/login', controller.login);
router.post('/logout', controller.logout);

export default router;
