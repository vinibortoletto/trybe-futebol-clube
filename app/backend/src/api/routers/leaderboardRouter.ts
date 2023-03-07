import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';
import LeaderboardService from '../services/LeaderboardService';

const router = Router();
const service = new LeaderboardService();
const controller = new LeaderboardController(service);

router.get('/leaderboard/home', controller.getLeaderboard.bind(controller));
router.get('/leaderboard/away', controller.getLeaderboard.bind(controller));
router.get('/leaderboard', controller.getLeaderboard.bind(controller));

export default router;
