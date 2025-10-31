import { Router } from 'express';
import controller from '@/modules/auth/controller';

const router = Router();

router.post('/send-otp-for-verification', controller.sendOTPForVerification);
router.post('/verify-otp-for-verification', controller.verifyOTPForVerification);

router.post('/create-account', controller.createAccount);
router.post('/login', controller.login);
router.post('/logout', controller.logout);

router.post('/reset-password/send-otp', controller.sendOTP_resetPassword);
router.post('/reset-password/verify-otp', controller.verifyOTP_resetPassword);
router.post('/reset-password/change-password', controller.changePassword_resetPassword);

export default router;
