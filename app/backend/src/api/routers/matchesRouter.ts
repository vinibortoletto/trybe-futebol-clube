import { Router } from 'express';
import MatchController from '../controllers/MatchController';
import MatchService from '../services/MatchService';

const router = Router();
const service = new MatchService();
const controller = new MatchController(service);

router.get('/matches', controller.findAll.bind(controller));

export default router;
