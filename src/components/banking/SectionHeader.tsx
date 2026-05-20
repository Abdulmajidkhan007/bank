import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/primitives/Text';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, action, onAction }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text variant="h3">{title}</Text>
      {onAction ? (
        <Pressable onPress={onAction} hitSlop={6}>
          <Text variant="bodySm" weight="600" style={{ color: colors.brand.accent }}>
            {action ?? t('common.see_all')}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
