import { NextFunction, Request, Response } from 'express';
import * as joi from 'joi';
import { invalidFields, requiredFields } from '../../utils/errorMessages';
import { Unauthorized } from '../errors';
import BadRequest from '../errors/BadRequest';

const schema = joi.object({
  email: joi.string().email().required().messages({
    'string.email': `${invalidFields}`,
    'any.required': `${requiredFields}`,
  }),
  password: joi.string().min(6).required().messages({
    'string.min': `${invalidFields}`,
    'any.required': `${requiredFields}`,
  }),
});

export default class ValidateLogin {
  public static validate(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Response | void {
    const { error } = schema.validate(req.body);
    if (!error) return next();
    if (error.message === invalidFields) throw new Unauthorized(invalidFields);
    throw new BadRequest(requiredFields);
  }
}
