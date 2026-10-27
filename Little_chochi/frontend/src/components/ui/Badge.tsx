import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize } from '@/styles/theme';

export function Badge({ text, color, bg }: { text: string; color?: string; bg?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg || colors.primarySoft }]}>
      <Text style={[styles.text, { color: color || colors.primaryDark }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
