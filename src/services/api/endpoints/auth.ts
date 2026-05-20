import { api, ApiError } from '@/services/api/client';

export type OtpRequestResponse = {
  ok: true;
  expiresInSeconds: number;
  resendInSeconds: number;
  devCode?: string;
};

export type OtpVerifyResponse = {
  ok: true;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phone: string;
    fullName: string;
    kycStatus: 'pending' | 'verified' | 'rejected';
  };
};

export const authApi = {
  async requestOtp(phone: string): Promise<OtpRequestResponse> {
    const res = await api.post<OtpRequestResponse>('/auth/otp/request', { phone });
    return res.data;
  },

  async verifyOtp(phone: string, code: string): Promise<OtpVerifyResponse> {
    const res = await api.post<OtpVerifyResponse>('/auth/otp/verify', { phone, code });
    return res.data;
  },

  async refresh(refresh: string): Promise<{ accessToken: string; refreshToken: string }> {
    const res = await api.post<{ ok: true; accessToken: string; refreshToken: string }>('/auth/refresh', { refresh });
    return res.data;
  },
};

export { ApiError };
