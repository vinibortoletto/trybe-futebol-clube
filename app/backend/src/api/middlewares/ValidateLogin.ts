import { NextFunction, Request, Response } from 'express';
import * as joi from 'joi';
import BadRequest from '../errors/BadRequest';

const schema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export default class ValidateLogin {
  public static validate(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Response | void {
    const { error } = schema.validate(req.body);
    const message = 'All fields must be filled';
    if (error) throw new BadRequest(message);
    next();
  }
}