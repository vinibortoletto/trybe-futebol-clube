import { NextFunction, Request, Response } from 'express';
import * as joi from 'joi';
import { JwtPayload } from 'jsonwebtoken';
import TokenHandler from '../../utils/TokenHandler';
import { tokenNotFound } from '../../utils/errorMessages';
import { Unauthorized } from '../errors';

const schema = joi.string().required();

export default class ValidateToken {
  public static validate(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    const { authorization } = req.headers;
    const { error } = schema.validate(authorization);

    if (error) throw new Unauthorized(tokenNotFound);

    const token: string = req.headers.authorization as string;
    const decodedUserInfo: string | JwtPayload = TokenHandler.decode(token);
    req.body.user = decodedUserInfo;

    next();
  }
}
