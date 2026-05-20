import { create } from 'zustand';
import { KycStatus } from '@/types/domain';
import { kycApi } from '@/services/api/endpoints/kyc';
import { config } from '@/config/env';
import { useAuthStore } from '@/store/auth.store';

type CapturedImage = {
  uri: string;
  base64: string;
  width: number;
  height: number;
};

type KycState = {
  passportFront: CapturedImage | null;
  selfie: CapturedImage | null;
  status: KycStatus;
  submissionId: string | null;
  submittedAt: number | null;
  reviewedAt: number | null;
  rejectionReason: string | null;

  setPassportFront: (img: CapturedImage | null) => void;
  setSelfie: (img: CapturedImage | null) => void;
  reset: () => void;
  submit: () => Promise<void>;
  refreshStatus: () => Promise<KycStatus>;
};

export const useKycStore = create<KycState>((set, get) => ({
  passportFront: null,
  selfie: null,
  status: 'pending',
  submissionId: null,
  submittedAt: null,
  reviewedAt: null,
  rejectionReason: null,

  setPassportFront: (passportFront) => set({ passportFront }),
  setSelfie: (selfie) => set({ selfie }),

  reset: () =>
    set({
      passportFront: null,
      selfie: null,
      submissionId: null,
    }),

  async submit() {
    const { passportFront, selfie } = get();
    if (!passportFront || !selfie) throw new Error('Capture both passport and selfie first');

    if (!config.hasBackend) {
      await new Promise((r) => setTimeout(r, 800));
      const status: KycStatus = 'submitted';
      set({ status, submissionId: 'kyc_demo', submittedAt: Date.now() });
      // Auto-verify after 5s in mock mode
      setTimeout(() => {
        set({ status: 'verified', reviewedAt: Date.now() });
        const user = useAuthStore.getState().user;
        if (user) useAuthStore.setState({ user: { ...user, kycStatus: 'verified' } });
      }, 5_000);
      return;
    }

    const res = await kycApi.submit({
      passportFront: toDataUrl(passportFront.base64),
      selfie: toDataUrl(selfie.base64),
    });

    set({
      submissionId: res.submissionId,
      status: res.status,
      submittedAt: Date.now(),
    });
    const user = useAuthStore.getState().user;
    if (user) useAuthStore.setState({ user: { ...user, kycStatus: res.status } });
  },

  async refreshStatus() {
    if (!config.hasBackend) return get().status;
    const res = await kycApi.status();
    set({
      status: res.status,
      submittedAt: res.submittedAt,
      reviewedAt: res.reviewedAt,
      rejectionReason: res.rejectionReason,
    });
    const user = useAuthStore.getState().user;
    if (user && user.kycStatus !== res.status) {
      useAuthStore.setState({ user: { ...user, kycStatus: res.status } });
    }
    return res.status;
  },
}));

function toDataUrl(base64: string): string {
  if (base64.startsWith('data:image')) return base64;
  return `data:image/jpeg;base64,${base64}`;
}
