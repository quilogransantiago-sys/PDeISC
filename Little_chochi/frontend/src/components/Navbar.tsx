import { useState } from 'react';
import { Pressable, Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from './Logo';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing, fontSize, radius } from '@/styles/theme';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/contacto', label: 'Contacto' },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function Navbar() {
  const { usuario, logout } = useAuth();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const isMobile = width < 860;

  const close = () => setOpen(false);

  const accountActions = usuario ? (
    <>
      <Link href="/cuenta" asChild onPress={close}>
        <Pressable style={styles.accountLink}>
          <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.accountText} numberOfLines={1}>
            {usuario.nombre}
          </Text>
        </Pressable>
      </Link>
      {(usuario.rol === 'admin' || usuario.rol === 'editor') && (
        <Link href="/admin" asChild onPress={close}>
          <Pressable style={styles.adminLink}>
            <Ionicons name="settings-outline" size={18} color={colors.textMuted} />
            <Text style={styles.adminText}>Panel</Text>
          </Pressable>
        </Link>
      )}
      <Pressable
        onPress={() => {
          close();
          logout();
        }}
        style={({ pressed }) => [styles.logoutLink, pressed && { opacity: 0.7 }]}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.logoutText}>Salir</Text>
      </Pressable>
    </>
  ) : (
    <>
      <Link href="/login" asChild onPress={close}>
        <Pressable style={styles.loginLink}>
          <Text style={styles.loginText}>Iniciar sesión</Text>
        </Pressable>
      </Link>
      <Link href="/registro" asChild onPress={close}>
        <Pressable style={styles.signupLink}>
          <Text style={styles.signupText}>Crear cuenta</Text>
        </Pressable>
      </Link>
    </>
  );

  return (
    <View style={styles.header}>
      <View style={styles.inner}>
        <Link href="/" asChild onPress={close}>
          <Pressable accessibilityRole="link" style={styles.brand}>
            <Logo size={42} />
            <Text style={styles.wordmark}>Little Chochi</Text>
          </Pressable>
        </Link>

        {isMobile ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir menú"
            onPress={() => setOpen((v) => !v)}
            style={styles.hamburger}
          >
            <Ionicons name={open ? 'close' : 'menu'} size={26} color={colors.text} />
          </Pressable>
        ) : (
          <>
            <View style={styles.navLinks}>
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} asChild>
                  <Pressable style={styles.navItem}>
                    <Text
                      style={[
                        styles.navText,
                        isActive(pathname, link.href) && styles.navTextActive,
                      ]}
                    >
                      {link.label}
                    </Text>
                  </Pressable>
                </Link>
              ))}
            </View>
            <View style={styles.account}>{accountActions}</View>
          </>
        )}
      </View>

      {isMobile && open ? (
        <View style={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} asChild onPress={close}>
              <Pressable style={styles.mobileItem}>
                <Text
                  style={[
                    styles.mobileText,
                    isActive(pathname, link.href) && styles.navTextActive,
                  ]}
                >
                  {link.label}
                </Text>
              </Pressable>
            </Link>
          ))}
          <View style={styles.mobileDivider} />
          <View style={styles.mobileAccount}>{accountActions}</View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 50,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    maxWidth: 1160,
    width: '100%',
    alignSelf: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  navItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  navText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textMuted,
  },
  navTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  accountLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  accountText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: fontSize.sm,
    maxWidth: 120,
  },
  adminLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  adminText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  logoutLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  logoutText: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  loginLink: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  loginText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: fontSize.sm,
  },
  signupLink: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  signupText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
    fontSize: fontSize.sm,
  },
  hamburger: {
    padding: 8,
  },
  mobileMenu: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 2,
  },
  mobileItem: {
    paddingVertical: 12,
  },
  mobileText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  mobileDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  mobileAccount: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
});
