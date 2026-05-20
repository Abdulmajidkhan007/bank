export const config = {
  apiBaseUrl: 'https://api.uzcard.mock/v1',
  appName: 'UzCard Bank',
  supportPhone: '+998 71 200 50 50',
  supportEmail: 'help@uzcard.mock',
  sessionTimeoutMs: 5 * 60_000,
  otpResendSec: 60,
  featureFlags: {
    rewards: true,
    analytics: true,
    qrTransfer: true,
    autoPay: true,
  },
} as const;
