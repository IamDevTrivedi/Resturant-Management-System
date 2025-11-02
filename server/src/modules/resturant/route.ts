import { protectOwner } from '@/middlewares/protectOwner';
import { protectRoute } from '@/middlewares/protectRoute';
import { Router } from 'express';
import controller from '@/modules/resturant/controller';
const router = Router();

router.post('/add-restaurant', protectOwner, protectRoute, controller.addRestaurant);

export default router;
