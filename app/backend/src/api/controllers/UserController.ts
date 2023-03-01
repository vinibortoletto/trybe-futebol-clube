import { NextFunction, Request, Response } from 'express';
import { OK } from '../../utils/httpStatusCodes';
import IUserController from '../interfaces/IUserController';
import IUserService from '../interfaces/IUserService';

export default class UserController implements IUserController {
  constructor(private _service: IUserService) {}

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await this._service.login(req.body);
      return res.status(OK).json({ token });
    } catch (error) {
      next(error);
    }
  }

  public async getRole(req: Request, res: Response, next: NextFunction) {
    const { user } = req.body;

    try {
      const role = await this._service.getRole(user);
      return res.status(OK).json({ role });
    } catch (error) {
      next(error);
    }
  }
}
