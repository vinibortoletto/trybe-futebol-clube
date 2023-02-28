import { NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '../../utils/httpStatusCodes';

export default class ErrorHandler {
  public static handle(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): Response {
    if (err instanceof Error && err.stack) {
      return res
        .status(Number(err.stack))
        .json({ message: err.message });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
}