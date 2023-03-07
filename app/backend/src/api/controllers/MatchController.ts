import { NextFunction, Request, Response } from 'express';
import { IMatchController, IMatchService, IGoals, IMatch } from '../interfaces';
import { CREATED, OK } from '../../utils/httpStatusCodes';

export default class MatchController implements IMatchController {
  constructor(private _service: IMatchService) {}

  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const { inProgress } = req.query;

    try {
      const matchList: IMatch[] = await this._service.findAll(inProgress as string);
      return res.status(OK).json(matchList);
    } catch (error) {
      next(error);
    }
  }

  public async finish(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const { id } = req.params;

    try {
      const finished: string = await this._service.finish(Number(id));
      return res.status(OK).json({ message: finished });
    } catch (error) {
      next(error);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const { id } = req.params;
    const goals: IGoals = req.body;

    try {
      const updated: string = await this._service.update(goals, Number(id));
      return res.status(OK).json({ message: updated });
    } catch (error) {
      next(error);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const newMatch: IMatch = req.body;

    try {
      const match: IMatch = await this._service.create(newMatch);
      return res.status(CREATED).json(match);
    } catch (error) {
      next(error);
    }
  }
}
