import { NextFunction, Request, Response } from 'express';

export default interface IMatchController {
  findAll(req: Request, res: Response, next: NextFunction): Promise<Response | void>
  finish(req: Request, res: Response, next: NextFunction): Promise<Response | void>
}
