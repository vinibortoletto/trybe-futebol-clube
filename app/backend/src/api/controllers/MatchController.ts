import { NextFunction, Request, Response } from 'express';
import { OK } from '../../utils/httpStatusCodes';
import IMatchController from '../interfaces/IMatchController';
import IMatchService from '../interfaces/IMatchService';

export default class MatchController implements IMatchController {
  constructor(private _service: IMatchService) {}

  public async findAll(req: Request, res: Response, next: NextFunction) {
    const { inProgress } = req.query;

    try {
      const matchList = await this._service.findAll(inProgress as string);
      return res.status(OK).json(matchList);
    } catch (error) {
      next(error);
    }
  }

  public async finish(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const finished = await this._service.finish(Number(id));
      return res.status(OK).json({ message: finished });
    } catch (error) {
      next(error);
    }
  }
}
