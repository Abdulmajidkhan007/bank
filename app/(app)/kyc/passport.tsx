import React from 'react';
import { useRouter } from 'expo-router';
import { CameraCapture } from '@/components/kyc/CameraCapture';
import { useKycStore } from '@/store/kyc.store';

export default function PassportCapture() {
  const router = useRouter();
  const setPassportFront = useKycStore((s) => s.setPassportFront);

  return (
    <CameraCapture
      facing="back"
      frameAspect={3 / 2}
      title="Scan passport"
      instruction="Place the bio page inside the frame. Avoid glare and shadows."
      onCancel={() => router.back()}
      onCaptured={(img) => {
        setPassportFront(img);
        router.replace('/(app)/kyc/selfie');
      }}
    />
  );
}
