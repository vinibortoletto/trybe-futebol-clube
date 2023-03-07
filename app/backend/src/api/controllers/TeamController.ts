import { NextFunction, Request, Response } from 'express';
import { OK } from '../../utils/httpStatusCodes';
import { ITeam, ITeamController, ITeamService } from '../interfaces';

export default class TeamController implements ITeamController {
  constructor(private _service: ITeamService) {}

  async findAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const teamList: ITeam[] = await this._service.findAll();
      return res.status(OK).json(teamList);
    } catch (error) {
      next(error);
    }
  }

  async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const { id } = req.params;

    try {
      const team: ITeam = await this._service.findById(Number(id));
      return res.status(OK).json(team);
    } catch (error) {
      next(error);
    }
  }
}
