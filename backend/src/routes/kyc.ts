import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { getStatus, getSubmission, submit } from '../kyc-store.js';

const router = Router();

const base64Image = z.string().refine((v) => /^data:image\/(jpeg|jpg|png);base64,/.test(v), {
  message: 'Expected data URL with image/jpeg or image/png',
});

const submitSchema = z.object({
  passportFront: base64Image,
  passportBack: base64Image.optional(),
  selfie: base64Image,
});

router.get('/status', requireAuth, (req, res) => {
  const userId = req.user!.sub;
  const sub = getSubmission(userId);
  res.json({
    ok: true,
    status: getStatus(userId),
    submittedAt: sub?.submittedAt ?? null,
    reviewedAt: sub?.reviewedAt ?? null,
    rejectionReason: sub?.rejectionReason ?? null,
  });
});

router.post('/submit', requireAuth, (req, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Invalid KYC payload',
      issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
    });
  }

  const submission = submit({
    userId: req.user!.sub,
    phone: req.user!.phone,
    passportFront: parsed.data.passportFront,
    passportBack: parsed.data.passportBack,
    selfie: parsed.data.selfie,
  });

  console.log(`[kyc] submission ${submission.id} for ${submission.phone}`);

  return res.json({
    ok: true,
    submissionId: submission.id,
    status: submission.status,
  });
});

export default router;
