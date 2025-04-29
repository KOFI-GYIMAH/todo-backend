import { NextFunction, Request, Response } from 'express';
import { apiResponse } from '../utils/apiResponse';

import jwt from 'jsonwebtoken';
import User from '../models/user.models';

declare module 'express' {
  interface Request {
    user?: any;
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return apiResponse(res, 401, 'Please authenticate');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return apiResponse(res, 401, 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    return apiResponse(res, 401, 'Please authenticate');
  }
};

export default auth;
