import { Response } from 'express';

export const apiResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = null
) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
};

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}
