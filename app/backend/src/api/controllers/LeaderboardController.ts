import { NextFunction, Request, Response } from 'express';
import { OK } from '../../utils/httpStatusCodes';
import { ILeaderboardController, ILeaderboardService } from '../interfaces';
import TTeamType from '../types/TTeamType';

export default class LeaderboardController implements ILeaderboardController {
  constructor(private _service: ILeaderboardService) {}

  public async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    const route = req.url.replace(/\//g, '').replace('leaderboard', '');
    const teamType = route || 'both';
    console.log(route);

    try {
      const leaderboardList = await this._service.getLeaderboard(teamType as TTeamType);
      return res.status(OK).json(leaderboardList);
    } catch (error) {
      next(error);
    }
  }
}
