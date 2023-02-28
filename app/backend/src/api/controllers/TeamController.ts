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
}
