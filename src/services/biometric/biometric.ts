import * as LocalAuthentication from 'expo-local-authentication';

export const biometric = {
  async isAvailable() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && enrolled;
  },
  async getType(): Promise<'face' | 'fingerprint' | 'iris' | 'none'> {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return 'face';
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return 'fingerprint';
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) return 'iris';
    return 'none';
  },
  async authenticate(promptMessage: string): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: '',
      disableDeviceFallback: false,
    });
    return result.success;
  },
};
