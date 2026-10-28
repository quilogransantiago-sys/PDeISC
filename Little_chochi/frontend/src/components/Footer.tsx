import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, social } from '@/styles/theme';

const REDES = [
  { icon: 'logo-facebook' as const, url: social.facebook, label: 'Facebook' },
  { icon: 'logo-instagram' as const, url: social.instagram, label: 'Instagram' },
  {
    icon: 'logo-whatsapp' as const,
    url: `https://wa.me/${social.whatsappNumber}`,
    label: 'WhatsApp',
  },
];

/** Pie de página compacto: marca, redes sociales y copyright. */
export function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.inner}>
        <Text style={styles.brand}>Little Chochi</Text>
        <Text style={styles.tagline}>
          Productos artesanales para bebés, hechos a mano con amor.
        </Text>

        <View style={styles.socialRow}>
          {REDES.map((r) => (
            <Pressable
              key={r.label}
              accessibilityRole="link"
              accessibilityLabel={r.label}
              onPress={() => Linking.openURL(r.url)}
              style={({ pressed }) => [styles.socialBtn, pressed && styles.pressed]}
            >
              <Ionicons name={r.icon} size={22} color={colors.primaryDark} />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Little Chochi. Todos los derechos reservados.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xxl,
  },
  inner: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  brand: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
  tagline: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  bottom: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  copyright: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});
