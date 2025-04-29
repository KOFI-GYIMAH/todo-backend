import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { NotFoundError, UnauthorizedError } from '../utils/apiResponse';

import bcrypt from 'bcrypt';
import User from '../models/user.models';

interface TokenPayload extends JwtPayload {
  userId: number;
}

interface JwtConfig {
  secret: string;
  expiresIn: number | string;
}

class AuthService {
  private readonly jwtConfig: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };

  constructor() {
    this.jwtConfig = {
      secret: this.getRequiredEnv('JWT_SECRET'),
      expiresIn: this.getRequiredEnv('JWT_EXPIRES_IN'),
      refreshSecret: this.getRequiredEnv('REFRESH_TOKEN_SECRET'),
      refreshExpiresIn: this.getRequiredEnv('REFRESH_TOKEN_EXPIRES_IN'),
    };
  }

  private getRequiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
  }

  async register(username: string, email: string, password: string) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // if (!user.isVerified) {
    //   throw new UnauthorizedError('Please verify your email first');
    // }

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    };
  }

  generateAccessToken(userId: number): string {
    const payload: TokenPayload = { userId };
    const options: SignOptions = {
      expiresIn: 36000,
    };
    return jwt.sign(payload, this.jwtConfig.secret, options);
  }

  generateRefreshToken(userId: number): string {
    const payload: TokenPayload = { userId };
    const options: SignOptions = {
      expiresIn: 36000,
    };
    return jwt.sign(payload, this.jwtConfig.refreshSecret, options);
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.jwtConfig.refreshSecret) as TokenPayload;
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }
}

export default AuthService;
