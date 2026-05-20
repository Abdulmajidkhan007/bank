import crypto from 'node:crypto';
import { config } from './config.js';

type Record = {
  phone: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
};

const byPhone = new Map<string, Record>();

function hash(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export function generateCode(): string {
  const max = 10 ** config.otp.length;
  const min = 10 ** (config.otp.length - 1);
  const n = crypto.randomInt(min, max);
  return String(n);
}

export type IssueResult =
  | { ok: true; code: string; cooldownSeconds: number; expiresInSeconds: number }
  | { ok: false; reason: 'cooldown'; retryInSeconds: number };

export function issue(phone: string): IssueResult {
  const now = Date.now();
  const existing = byPhone.get(phone);
  if (existing) {
    const sinceLast = (now - existing.lastSentAt) / 1000;
    if (sinceLast < config.otp.resendCooldownSeconds) {
      return { ok: false, reason: 'cooldown', retryInSeconds: Math.ceil(config.otp.resendCooldownSeconds - sinceLast) };
    }
  }
  const code = generateCode();
  byPhone.set(phone, {
    phone,
    codeHash: hash(code),
    expiresAt: now + config.otp.ttlSeconds * 1000,
    attempts: 0,
    lastSentAt: now,
  });
  return {
    ok: true,
    code,
    cooldownSeconds: config.otp.resendCooldownSeconds,
    expiresInSeconds: config.otp.ttlSeconds,
  };
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'expired' | 'too_many_attempts' | 'invalid' };

export function verify(phone: string, code: string): VerifyResult {
  const rec = byPhone.get(phone);
  if (!rec) return { ok: false, reason: 'not_found' };

  if (Date.now() > rec.expiresAt) {
    byPhone.delete(phone);
    return { ok: false, reason: 'expired' };
  }
  if (rec.attempts >= config.otp.maxAttempts) {
    byPhone.delete(phone);
    return { ok: false, reason: 'too_many_attempts' };
  }
  rec.attempts += 1;
  if (rec.codeHash !== hash(code)) {
    return { ok: false, reason: 'invalid' };
  }
  byPhone.delete(phone);
  return { ok: true };
}

// Periodic cleanup so the Map doesn't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of byPhone) {
    if (now > v.expiresAt + 60_000) byPhone.delete(k);
  }
}, 60_000).unref?.();
