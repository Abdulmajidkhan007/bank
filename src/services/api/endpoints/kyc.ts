import { api } from '@/services/api/client';
import { KycStatus } from '@/types/domain';

export type KycStatusResponse = {
  ok: true;
  status: KycStatus;
  submittedAt: number | null;
  reviewedAt: number | null;
  rejectionReason: string | null;
};

export type KycSubmitResponse = {
  ok: true;
  submissionId: string;
  status: KycStatus;
};

export const kycApi = {
  async status(): Promise<KycStatusResponse> {
    const res = await api.get<KycStatusResponse>('/kyc/status');
    return res.data;
  },

  async submit(input: {
    passportFront: string;
    passportBack?: string;
    selfie: string;
  }): Promise<KycSubmitResponse> {
    const res = await api.post<KycSubmitResponse>('/kyc/submit', input);
    return res.data;
  },
};
