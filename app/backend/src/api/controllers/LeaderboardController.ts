import { NextFunction, Request, Response } from 'express';
import { OK } from '../../utils/httpStatusCodes';
import { ILeaderboardController, ILeaderboardService } from '../interfaces';

export default class LeaderboardController implements ILeaderboardController {
  constructor(private _service: ILeaderboardService) {}

  public async getHomeLeaderboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const leaderboardList = await this._service.getHomeLeaderboard();
      return res.status(OK).json(leaderboardList);
    } catch (error) {
      next(error);
    }
  }

  public async getAwayLeaderboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const leaderboardList = await this._service.getAwayLeaderboard();
      return res.status(OK).json(leaderboardList);
    } catch (error) {
      next(error);
    }
  }

  public async getLeaderboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const leaderboardList = await this._service.getLeaderboard();
      return res.status(OK).json(leaderboardList);
    } catch (error) {
      next(error);
    }
  }
}
