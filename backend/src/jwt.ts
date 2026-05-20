import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from './config.js';

export type AccessPayload = { sub: string; phone: string };
export type RefreshPayload = { sub: string; phone: string; type: 'refresh' };

export function signAccess(payload: AccessPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessTtl } as SignOptions);
}

export function signRefresh(payload: Omit<RefreshPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'refresh' }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshTtl } as SignOptions);
}

export function verifyAccess(token: string): AccessPayload {
  return jwt.verify(token, config.jwt.accessSecret) as AccessPayload;
}

export function verifyRefresh(token: string): RefreshPayload {
  const payload = jwt.verify(token, config.jwt.refreshSecret) as RefreshPayload;
  if (payload.type !== 'refresh') throw new Error('not a refresh token');
  return payload;
}
