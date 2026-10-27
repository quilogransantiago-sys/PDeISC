import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Logo } from './Logo';
import { colors, spacing, fontSize } from '@/styles/theme';

export function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.inner}>
        <View style={styles.column}>
          <Logo size={40} withText />
          <Text style={styles.tagline}>
            Productos artesanales para bebés, hechos a mano con amor y dedicación.
          </Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.heading}>Navegación</Text>
          <Link href="/" style={styles.link}>
            Inicio
          </Link>
          <Link href="/catalogo" style={styles.link}>
            Catálogo
          </Link>
          <Link href="/contacto" style={styles.link}>
            Contacto
          </Link>
          <Link href="/login" style={styles.link}>
            Mi cuenta
          </Link>
        </View>

        <View style={styles.column}>
          <Text style={styles.heading}>Contacto</Text>
          <Text style={styles.text}>Consultanos por WhatsApp o correo.</Text>
          <Text style={styles.text}>Enviamos a todo el país.</Text>
          <Link href="/contacto" style={styles.contactLink}>
            Escribinos
          </Link>
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
  },
  inner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    maxWidth: 1160,
    width: '100%',
    alignSelf: 'center',
  },
  column: {
    flex: 1,
    minWidth: 220,
    gap: spacing.sm,
  },
  heading: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  text: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  link: {
    color: colors.text,
    fontSize: fontSize.sm,
    paddingVertical: 2,
  },
  contactLink: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
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
  },
});
