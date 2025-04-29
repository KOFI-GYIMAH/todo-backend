import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { apiResponse } from '../../utils/apiResponse';

import AuthService from '../../services/auth.service';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse(res, 400, errors.array()[0].msg);
      }

      const { username, email, password } = req.body;
      await this.authService.register(username, email, password);

      return apiResponse(res, 201, 'User registered successfully');
    } catch (err: any) {
      return apiResponse(res, err.statusCode || 500, err.message);
    }
  };

  login = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse(res, 400, errors.array()[0].msg);
      }

      console.log('req.body');

      const { email, password } = req.body;
      const { accessToken, refreshToken, user } = await this.authService.login(
        email,
        password
      );
      console.log('response');

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return apiResponse(res, 200, 'Login successful', {
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err: any) {
      return apiResponse(res, err.statusCode || 500, err.message);
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return apiResponse(res, 401, 'Refresh token not provided');
      }

      const { userId } = this.authService.verifyRefreshToken(refreshToken);
      const accessToken = this.authService.generateAccessToken(userId);

      return apiResponse(res, 200, 'Token refreshed successfully', {
        accessToken,
      });
    } catch (err: any) {
      return apiResponse(res, 401, 'Invalid refresh token');
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie('refreshToken');
      return apiResponse(res, 200, 'Logged out successfully');
    } catch (err: any) {
      return apiResponse(res, 500, err.message);
    }
  };
}

export default AuthController;
