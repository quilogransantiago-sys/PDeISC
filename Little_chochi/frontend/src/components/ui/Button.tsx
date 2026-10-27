import { Pressable, Text, ActivityIndicator, StyleSheet, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, fontSize } from '@/styles/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const palette = {
    primary: { bg: colors.primary, fg: colors.textOnPrimary, border: colors.primary },
    secondary: { bg: colors.secondary, fg: colors.textOnPrimary, border: colors.secondary },
    accent: { bg: colors.accent, fg: colors.text, border: colors.accent },
    outline: { bg: 'transparent', fg: colors.primary, border: colors.primary },
    ghost: { bg: 'transparent', fg: colors.text, border: 'transparent' },
    danger: { bg: colors.danger, fg: colors.textOnPrimary, border: colors.danger },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : palette.fg} />
      ) : (
        <>
          {icon ? (
            <Ionicons name={icon} size={18} color={palette.fg} style={styles.icon} />
          ) : null}
          <Text style={[styles.label, { color: palette.fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  icon: {
    marginRight: 2,
  },
});
