import crypto from 'node:crypto';

export type KycStatus = 'pending' | 'submitted' | 'verified' | 'rejected';

export type KycSubmission = {
  id: string;
  userId: string;
  phone: string;
  status: KycStatus;
  passportFront?: string;
  passportBack?: string;
  selfie?: string;
  submittedAt: number;
  reviewedAt?: number;
  rejectionReason?: string;
};

const byUserId = new Map<string, KycSubmission>();

export function getStatus(userId: string): KycStatus {
  return byUserId.get(userId)?.status ?? 'pending';
}

export function getSubmission(userId: string): KycSubmission | undefined {
  return byUserId.get(userId);
}

export function submit(input: {
  userId: string;
  phone: string;
  passportFront: string;
  passportBack?: string;
  selfie: string;
}): KycSubmission {
  const submission: KycSubmission = {
    id: 'kyc_' + crypto.randomBytes(6).toString('hex'),
    userId: input.userId,
    phone: input.phone,
    status: 'submitted',
    passportFront: input.passportFront,
    passportBack: input.passportBack,
    selfie: input.selfie,
    submittedAt: Date.now(),
  };
  byUserId.set(input.userId, submission);

  // Demo auto-review: after 6s mark as verified.
  // In production this is where you would call Sumsub/MyID's review API and
  // wire a webhook to mutate the status.
  setTimeout(() => {
    const cur = byUserId.get(input.userId);
    if (cur && cur.status === 'submitted') {
      byUserId.set(input.userId, { ...cur, status: 'verified', reviewedAt: Date.now() });
    }
  }, 6_000).unref?.();

  return submission;
}

export function setStatus(userId: string, status: KycStatus, reason?: string) {
  const cur = byUserId.get(userId);
  if (!cur) return;
  byUserId.set(userId, { ...cur, status, reviewedAt: Date.now(), rejectionReason: reason });
}
