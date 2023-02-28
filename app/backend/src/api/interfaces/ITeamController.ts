import { Request, Response } from 'express';

export default interface ITeamController {
  findAll(req: Request, res: Response): Promise<Response | void>
  findById(req: Request, res: Response): Promise<Response | void>
}
