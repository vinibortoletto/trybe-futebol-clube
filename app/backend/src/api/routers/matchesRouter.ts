import { Router } from 'express';
import MatchController from '../controllers/MatchController';
import ValidateToken from '../middlewares/ValidateToken';
import MatchService from '../services/MatchService';

const router = Router();
const service = new MatchService();
const controller = new MatchController(service);

router.get('/matches', controller.findAll.bind(controller));

router.patch(
  '/matches/:id/finish',
  ValidateToken.validate,
  controller.finish.bind(controller),
);

router.patch(
  '/matches/:id',
  ValidateToken.validate,
  controller.update.bind(controller),
);

export default router;
