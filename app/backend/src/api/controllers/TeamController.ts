import { Request, Response } from 'express';
import { OK } from '../../utils/httpStatusCodes';
import ITeamController from '../interfaces/ITeamController';
import ITeamService from '../interfaces/ITeamService';

export default class TeamController implements ITeamController {
  constructor(private _service: ITeamService) {}

  async findAll(_req: Request, res: Response) {
    const teamList = await this._service.findAll();
    return res.status(OK).json(teamList);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await this._service.findById(Number(id));
    return res.status(OK).json(team);
  }
}
