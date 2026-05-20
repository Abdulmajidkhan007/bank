import { Router } from 'express';
import { z } from 'zod';
import { eskiz } from '../eskiz.js';
import { issue, verify } from '../otp-store.js';
import { signAccess, signRefresh, verifyRefresh } from '../jwt.js';
import { config } from '../config.js';

const router = Router();

const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.startsWith('998') && v.length === 12, { message: 'invalid_phone' });

const requestSchema = z.object({ phone: z.string().min(9) });
const verifySchema = z.object({ phone: z.string().min(9), code: z.string().regex(/^\d{4,8}$/) });
const refreshSchema = z.object({ refresh: z.string().min(10) });

router.post('/otp/request', async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'phone required' });
  }
  const phoneCheck = phoneSchema.safeParse(parsed.data.phone);
  if (!phoneCheck.success) {
    return res.status(400).json({ code: 'INVALID_PHONE', message: 'Use a 12-digit Uzbek phone' });
  }
  const phone = phoneCheck.data;

  const issued = issue(phone);
  if (!issued.ok) {
    return res.status(429).json({
      code: 'COOLDOWN',
      message: `Resend in ${issued.retryInSeconds}s`,
      retryInSeconds: issued.retryInSeconds,
    });
  }

  const message = `UzCard Bank tasdiqlash kodi: ${issued.code}. Hech kimga aytmang.`;
  const sent = await eskiz.sendSms(phone, message);
  if (!sent.ok) {
    return res.status(502).json({ code: 'SMS_FAILED', message: 'Could not send SMS', detail: sent.error });
  }

  return res.json({
    ok: true,
    expiresInSeconds: issued.expiresInSeconds,
    resendInSeconds: issued.cooldownSeconds,
    // In dev mode we echo the code back so the developer can test without a real SMS.
    devCode: config.eskiz.live ? undefined : issued.code,
  });
});

router.post('/otp/verify', async (req, res) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'phone and code required' });
  }
  const phoneCheck = phoneSchema.safeParse(parsed.data.phone);
  if (!phoneCheck.success) {
    return res.status(400).json({ code: 'INVALID_PHONE', message: 'Use a 12-digit Uzbek phone' });
  }
  const phone = phoneCheck.data;

  const result = verify(phone, parsed.data.code);
  if (!result.ok) {
    const map = {
      not_found: 'Code expired or never requested',
      expired: 'Code expired, request a new one',
      too_many_attempts: 'Too many attempts, request a new code',
      invalid: 'Incorrect code',
    } as const;
    return res.status(401).json({ code: result.reason.toUpperCase(), message: map[result.reason] });
  }

  const userId = `user_${phone}`;
  const accessToken = signAccess({ sub: userId, phone });
  const refreshToken = signRefresh({ sub: userId, phone });

  return res.json({
    ok: true,
    accessToken,
    refreshToken,
    user: {
      id: userId,
      phone: `+${phone}`,
      fullName: '',
      kycStatus: 'pending',
    },
  });
});

router.post('/refresh', async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: 'BAD_REQUEST', message: 'refresh required' });
  }
  try {
    const payload = verifyRefresh(parsed.data.refresh);
    const accessToken = signAccess({ sub: payload.sub, phone: payload.phone });
    const refreshToken = signRefresh({ sub: payload.sub, phone: payload.phone });
    return res.json({ ok: true, accessToken, refreshToken });
  } catch {
    return res.status(401).json({ code: 'INVALID_REFRESH', message: 'Refresh token invalid or expired' });
  }
});

export default router;
