import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontSize } from '@/styles/theme';
import { useTheme } from '@/context/ThemeContext';

export function Badge({ text, color, bg }: { text: string; color?: string; bg?: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[styles.badge, { backgroundColor: bg || colors.primarySoft }]}>
      <Text style={[styles.text, { color: color || colors.primaryDark }]}>{text}</Text>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
