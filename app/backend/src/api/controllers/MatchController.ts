import { NextFunction, Request, Response } from 'express';
import { OK } from '../../utils/httpStatusCodes';
import IMatchController from '../interfaces/IMatchController';
import IMatchService from '../interfaces/IMatchService';

export default class MatchController implements IMatchController {
  constructor(private _service: IMatchService) {}

  async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const matchList = await this._service.findAll();
      return res.status(OK).json(matchList);
    } catch (error) {
      next(error);
    }
  }
}
