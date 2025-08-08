import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextData {
  user?: { id?: string; email?: string; roles?: string[] };
  ip?: string;
  userAgent?: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<RequestContextData>();

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const initial: RequestContextData = {
      user: (req as any).user || undefined,
      ip: req.ip || req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    asyncLocalStorage.run(initial, () => next());
  }
}
