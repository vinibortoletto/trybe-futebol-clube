import { NextFunction, Request, Response } from 'express';

export default interface ILeaderboardController {
  getHomeLeaderboard(req: Request, res: Response, next: NextFunction): Promise<Response | void>
}
