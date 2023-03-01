import { NextFunction, Request, Response } from 'express';
import * as joi from 'joi';
import { Secret, verify } from 'jsonwebtoken';
import { invalidToken, tokenNotFound } from '../../utils/errorMessages';
import { Unauthorized } from '../errors';

const schema = joi.string().required();
const secret = process.env.JTW_SECRET as Secret;

export default class ValidateToken {
  public static validate(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    const { authorization } = req.headers;
    const { error } = schema.validate(authorization);

    if (error) throw new Unauthorized(tokenNotFound);

    const token = req.headers.authorization as string;

    try {
      const decodedUserInfo = verify(token, secret);
      req.body.user = decodedUserInfo;
    } catch (e) {
      throw new Unauthorized(invalidToken);
    }

    next();
  }
}
