import { Router } from 'express';
import TeamController from '../controllers/TeamController';
import TeamService from '../services/TeamService';

const router = Router();
const service = new TeamService();
const controller = new TeamController(service);

router.get('/teams', controller.findAll.bind(controller));

export default router;
