import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '@/styles/theme';

export function Loading({ mensaje = 'Cargando…' }: { mensaje?: string }) {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{mensaje}</Text>
    </View>
  );
}

export function FullScreenLoading() {
  return (
    <View style={styles.full}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Cargando…</Text>
    </View>
  );
}

export function EmptyState({
  title,
  mensaje,
  icon = 'leaf-outline',
}: {
  title: string;
  mensaje?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={34} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {mensaje ? <Text style={styles.text}>{mensaje}</Text> : null}
    </View>
  );
}

export function ErrorBanner({ mensaje }: { mensaje: string }) {
  return (
    <View style={styles.errorBanner}>
      <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
      <Text style={styles.errorBannerText}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  full: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  text: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.dangerSoft,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    flex: 1,
  },
});
