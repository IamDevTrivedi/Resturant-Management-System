import { Router } from 'express';
import controller from '@/modules/booking/controller';
import { protectCustomer } from '@/middlewares/protectCustomer';
import { protectRoute } from '@/middlewares/protectRoute';

const router = Router();

router.post('/create-booking', protectCustomer, protectRoute, controller.createBooking);

export default router;
