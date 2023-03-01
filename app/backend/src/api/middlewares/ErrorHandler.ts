import { NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '../../utils/httpStatusCodes';

export default class ErrorHandler {
  public static handle(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): Response {
    const errorMessage = 'Internal Server Error';

    if (err.message === errorMessage) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: errorMessage });
    }

    return res
      .status(Number(err.stack))
      .json({ message: err.message });
  }
}
