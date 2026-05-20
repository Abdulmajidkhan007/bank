import type { NextFunction, Request, Response } from 'express';

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const MAX = 30;

const buckets = new Map<string, Bucket>();

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = (req.ip ?? 'unknown') + ':' + req.path;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  bucket.count += 1;
  if (bucket.count > MAX) {
    const retryIn = Math.ceil((bucket.resetAt - now) / 1000);
    return res.status(429).json({ code: 'RATE_LIMITED', message: `Too many requests, retry in ${retryIn}s` });
  }
  next();
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
}, WINDOW_MS).unref?.();
