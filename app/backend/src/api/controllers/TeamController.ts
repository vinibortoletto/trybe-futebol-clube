import { NextFunction, Request, Response } from 'express';
import { OK } from '../../utils/httpStatusCodes';
import ITeamController from '../interfaces/ITeamController';
import ITeamService from '../interfaces/ITeamService';

export default class TeamController implements ITeamController {
  constructor(private _service: ITeamService) {}

  async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const teamList = await this._service.findAll();
      return res.status(OK).json(teamList);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const team = await this._service.findById(Number(id));
      return res.status(OK).json(team);
    } catch (error) {
      next(error);
    }
  }
}
