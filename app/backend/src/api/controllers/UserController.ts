import { Request, Response } from 'express';
import { OK } from '../../utils/httpStatusCodes';
import IUserController from '../interfaces/IUserController';
import IUserService from '../interfaces/IUserService';

export default class UserController implements IUserController {
  constructor(private _service: IUserService) {}

  async login(req: Request, res: Response) {
    const token = await this._service.login(req.body);
    return res.status(OK).json(token);
  }
}
