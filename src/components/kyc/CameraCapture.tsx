import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/primitives/Text';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { IconButton } from '@/components/buttons/IconButton';
import { Close } from '@/components/icons';
import { useTheme } from '@/theme/ThemeProvider';

export type CapturedImage = {
  uri: string;
  base64: string;
  width: number;
  height: number;
};

type Props = {
  facing: CameraType;
  /** Aspect of the framing overlay — for passport use 3/2, for selfie use 1 */
  frameAspect?: number;
  title: string;
  instruction: string;
  onCancel: () => void;
  onCaptured: (img: CapturedImage) => void;
};

export function CameraCapture({ facing, frameAspect = 3 / 2, title, instruction, onCancel, onCaptured }: Props) {
  const { colors, spacing, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={[styles.full, { backgroundColor: '#000' }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.full, { backgroundColor: colors.bg.base, paddingHorizontal: spacing.xl, paddingTop: insets.top + spacing.lg }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <IconButton onPress={onCancel}>
            <Close size={20} color={colors.text.primary} />
          </IconButton>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', gap: spacing.lg }}>
          <Text variant="displayLg" align="center">Camera access needed</Text>
          <Text variant="bodyLg" tone="secondary" align="center">
            We use the camera only to verify your identity. The photos never leave the secure pipeline.
          </Text>
          <PrimaryButton label="Allow camera" onPress={() => void requestPermission()} />
        </View>
      </View>
    );
  }

  const snap = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85, skipProcessing: false });
      if (!photo?.uri) {
        setBusy(false);
        return;
      }
      // Compress and base64-encode for upload.
      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 1280 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
      );
      onCaptured({
        uri: manipulated.uri,
        base64: manipulated.base64 ?? '',
        width: manipulated.width,
        height: manipulated.height,
      });
    } catch {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.full, { backgroundColor: '#000' }]}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />

      <View pointerEvents="box-none" style={[styles.overlay, { paddingTop: insets.top + spacing.lg }]}>
        <View style={[styles.topBar, { paddingHorizontal: spacing.xl }]}>
          <IconButton onPress={onCancel} surface="transparent">
            <Close size={20} color="#fff" />
          </IconButton>
          <View style={{ flex: 1 }}>
            <Text variant="h3" tone="onBrand" align="center">{title}</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.frameWrap}>
          <View
            style={[
              styles.frame,
              {
                aspectRatio: frameAspect,
                borderRadius: radii.xl,
                borderColor: '#fff',
              },
            ]}
          >
            <Corner pos="tl" />
            <Corner pos="tr" />
            <Corner pos="bl" />
            <Corner pos="br" />
          </View>
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text variant="bodySm" tone="onBrand" align="center" style={{ marginTop: spacing.xl, paddingHorizontal: spacing.xl, opacity: 0.85 }}>
              {instruction}
            </Text>
          </Animated.View>
        </View>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.xl }]}>
          <Pressable
            onPress={snap}
            disabled={busy}
            style={({ pressed }) => [
              styles.shutter,
              {
                borderColor: '#fff',
                opacity: pressed || busy ? 0.7 : 1,
              },
            ]}
          >
            <View style={[styles.shutterCore, { backgroundColor: '#fff' }]} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const offset = -2;
  const size = 22;
  const thickness = 3;
  const base = { position: 'absolute' as const, width: size, height: size, borderColor: '#fff' };
  if (pos === 'tl') return <View style={[base, { top: offset, left: offset, borderTopWidth: thickness, borderLeftWidth: thickness, borderTopLeftRadius: 12 }]} />;
  if (pos === 'tr') return <View style={[base, { top: offset, right: offset, borderTopWidth: thickness, borderRightWidth: thickness, borderTopRightRadius: 12 }]} />;
  if (pos === 'bl') return <View style={[base, { bottom: offset, left: offset, borderBottomWidth: thickness, borderLeftWidth: thickness, borderBottomLeftRadius: 12 }]} />;
  return <View style={[base, { bottom: offset, right: offset, borderBottomWidth: thickness, borderRightWidth: thickness, borderBottomRightRadius: 12 }]} />;
}

const styles = StyleSheet.create({
  full: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', alignItems: 'center' },
  frameWrap: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  frame: {
    width: '100%',
    borderWidth: 1.5,
    backgroundColor: 'rgba(0,0,0,0.001)',
  },
  bottomBar: { alignItems: 'center' },
  shutter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCore: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
});
