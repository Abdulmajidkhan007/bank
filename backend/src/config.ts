import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

function num(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number(v);
  if (Number.isNaN(n)) throw new Error(`Invalid number env: ${name}`);
  return n;
}

export const config = {
  port: num('PORT', 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',

  eskiz: {
    email: required('ESKIZ_EMAIL', 'demo@local'),
    password: required('ESKIZ_PASSWORD', 'demo'),
    from: process.env.ESKIZ_FROM ?? '4546',
    live: (process.env.ESKIZ_LIVE ?? 'false').toLowerCase() === 'true',
  },

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', 'dev-access-secret-change-me'),
    refreshSecret: required('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-me'),
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '30d',
  },

  otp: {
    length: num('OTP_LENGTH', 6),
    ttlSeconds: num('OTP_TTL_SECONDS', 120),
    resendCooldownSeconds: num('OTP_RESEND_COOLDOWN_SECONDS', 60),
    maxAttempts: num('OTP_MAX_ATTEMPTS', 5),
  },
} as const;
