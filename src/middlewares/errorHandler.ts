import { NextFunction, Request, Response } from 'express';
import { apiResponse } from '../utils/apiResponse';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err.name === 'UnauthorizedError') {
    return apiResponse(res, 401, 'Please authenticate');
  }

  if (err.name === 'NotFoundError') {
    return apiResponse(res, 404, err.message);
  }

  return apiResponse(res, 500, 'Something went wrong');
};
