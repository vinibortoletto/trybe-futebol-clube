import { NextFunction, Request, Response } from 'express';
import { OK } from '../../utils/httpStatusCodes';
import IUserController from '../interfaces/IUserController';
import IUserService from '../interfaces/IUserService';

export default class UserController implements IUserController {
  constructor(private _service: IUserService) {}

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const token: string = await this._service.login(req.body);
      return res.status(OK).json({ token });
    } catch (error) {
      next(error);
    }
  }

  public async getRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const { user } = req.body;

    try {
      const role: string | undefined = await this._service.getRole(user);
      return res.status(OK).json({ role });
    } catch (error) {
      next(error);
    }
  }
}
