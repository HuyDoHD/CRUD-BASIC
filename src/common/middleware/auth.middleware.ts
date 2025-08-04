// src/common/middleware/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Bearer <token>
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      req['user'] = payload; // 👈 Gắn user vào request
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
