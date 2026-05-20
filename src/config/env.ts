const apiBaseUrlFromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;

export const config = {
  apiBaseUrl: apiBaseUrlFromEnv ?? '',
  hasBackend: Boolean(apiBaseUrlFromEnv),
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
