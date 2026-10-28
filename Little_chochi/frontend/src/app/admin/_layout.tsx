import { Stack, Redirect, Link, usePathname } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/Logo';
import { FullScreenLoading } from '@/components/ui/Feedback';
import { colors, spacing, fontSize, radius, maxContentWidth } from '@/styles/theme';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout() {
  const { usuario, initializing, logout } = useAuth();
  const pathname = usePathname();

  if (initializing) return <FullScreenLoading />;
  if (!usuario) return <Redirect href="/login" />;
  if (usuario.rol !== 'admin' && usuario.rol !== 'editor') return <Redirect href="/" />;

  const links = [
    { href: '/admin' as const, label: 'Resumen', icon: 'speedometer-outline' as const },
    { href: '/admin/productos' as const, label: 'Productos', icon: 'grid-outline' as const },
    ...(usuario.rol === 'admin'
      ? [{ href: '/admin/usuarios' as const, label: 'Usuarios', icon: 'people-outline' as const }]
      : []),
  ];

  return (
    <View style={styles.root}>
      <View style={styles.topbar}>
        <View style={styles.topbarInner}>
          <Link href="/" asChild>
            <Pressable style={styles.brand}>
              <Logo size={34} />
              <Text style={styles.brandText}>Little Chochi · Panel</Text>
            </Pressable>
          </Link>
          <View style={styles.topActions}>
            <Link href="/" asChild>
              <Pressable style={styles.storeLink}>
                <Ionicons name="storefront-outline" size={18} color={colors.primary} />
                <Text style={styles.storeText}>Ver tienda</Text>
              </Pressable>
            </Link>
            <Pressable onPress={logout} style={styles.logout}>
              <Ionicons name="log-out-outline" size={18} color={colors.danger} />
              <Text style={styles.logoutText}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.navBar}>
        <View style={styles.navInner}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} asChild>
                <Pressable style={StyleSheet.flatten([styles.navItem, active && styles.navItemActive])}>
                  <Ionicons
                    name={link.icon}
                    size={16}
                    color={active ? colors.textOnPrimary : colors.textMuted}
                  />
                  <Text style={[styles.navText, active && styles.navTextActive]}>{link.label}</Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      </View>

      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topbar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topbarInner: {
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandText: { fontSize: fontSize.md, fontWeight: '800', color: colors.text },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  storeLink: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 },
  storeText: { color: colors.primary, fontWeight: '600', fontSize: fontSize.sm },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 },
  logoutText: { color: colors.danger, fontWeight: '600', fontSize: fontSize.sm },
  navBar: {
    backgroundColor: colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navInner: {
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
  },
  navItemActive: { backgroundColor: colors.primary },
  navText: { color: colors.textMuted, fontWeight: '600', fontSize: fontSize.sm },
  navTextActive: { color: colors.textOnPrimary },
  content: { flex: 1 },
});
