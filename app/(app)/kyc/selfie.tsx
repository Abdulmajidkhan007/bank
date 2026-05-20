import React from 'react';
import { useRouter } from 'expo-router';
import { CameraCapture } from '@/components/kyc/CameraCapture';
import { useKycStore } from '@/store/kyc.store';

export default function SelfieCapture() {
  const router = useRouter();
  const setSelfie = useKycStore((s) => s.setSelfie);

  return (
    <CameraCapture
      facing="front"
      frameAspect={1}
      title="Take a selfie"
      instruction="Center your face and look directly at the camera."
      onCancel={() => router.back()}
      onCaptured={(img) => {
        setSelfie(img);
        router.replace('/(app)/kyc/review');
      }}
    />
  );
}
