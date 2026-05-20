import type { NextFunction, Request, Response } from 'express';
import { verifyAccess, type AccessPayload } from '../jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: AccessPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ code: 'NO_TOKEN', message: 'Authentication required' });
  }
  try {
    req.user = verifyAccess(header.slice(7));
    next();
  } catch {
    return res.status(401).json({ code: 'INVALID_TOKEN', message: 'Token invalid or expired' });
  }
}
