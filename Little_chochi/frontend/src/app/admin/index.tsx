import { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Loading, ErrorBanner } from '@/components/ui/Feedback';
import { colors, spacing, fontSize, radius, maxContentWidth } from '@/styles/theme';
import { useAuth } from '@/context/AuthContext';
import { productsApi } from '@/modules/api/products';
import { categoriesApi } from '@/modules/api/categories';
import { usersApi } from '@/modules/api/users';

export default function AdminDashboard() {
  const { usuario } = useAuth();
  const [totales, setTotales] = useState<{ productos: number; categorias: number; usuarios: number | null }>({
    productos: 0,
    categorias: 0,
    usuarios: null,
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [prods, cats] = await Promise.all([productsApi.list(), categoriesApi.list()]);
        let usuarios: number | null = null;
        if (usuario?.rol === 'admin') {
          try {
            const users = await usersApi.list();
            usuarios = users.data.length;
          } catch {
            // si falla la carga de usuarios, mostramos solo productos/categorías
          }
        }
        if (active) {
          setTotales({ productos: prods.data.length, categorias: cats.data.length, usuarios });
          setError(null);
        }
      } catch (e: any) {
        if (active) setError(e?.message || 'No se pudieron cargar los datos');
      } finally {
        if (active) setCargando(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [usuario]);

  const stats = [
    { label: 'Productos', value: totales.productos, icon: 'grid-outline' as const, color: colors.primary },
    { label: 'Categorías', value: totales.categorias, icon: 'pricetags-outline' as const, color: colors.secondary },
    ...(totales.usuarios !== null
      ? [{ label: 'Usuarios', value: totales.usuarios, icon: 'people-outline' as const, color: colors.softBlueDark }]
      : []),
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <View style={styles.welcome}>
          <View style={styles.welcomeIcon}>
            <Ionicons name="sparkles-outline" size={28} color={colors.secondary} />
          </View>
          <View style={styles.welcomeText}>
            <Text style={styles.title}>Panel de administración</Text>
            <Text style={styles.subtitle}>
              Hola {usuario?.nombre}, acá gestionás el contenido de la tienda.
            </Text>
          </View>
        </View>

        {error ? <ErrorBanner mensaje={error} /> : null}

        {cargando ? (
          <Loading />
        ) : (
          <View style={styles.statsGrid}>
            {stats.map((s) => (
              <View key={s.label} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: s.color + '1A' }]}>
                  <Ionicons name={s.icon} size={24} color={s.color} />
                </View>
                <View>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionsGrid}>
          <Link href="/admin/productos" asChild>
            <View style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft }]}>
                <Ionicons name="grid-outline" size={26} color={colors.primary} />
              </View>
              <Text style={styles.actionTitle}>Productos</Text>
              <Text style={styles.actionText}>Crear, editar y eliminar productos.</Text>
            </View>
          </Link>
          {usuario?.rol === 'admin' ? (
            <Link href="/admin/usuarios" asChild>
              <View style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: colors.secondarySoft }]}>
                  <Ionicons name="people-outline" size={26} color={colors.secondary} />
                </View>
                <Text style={styles.actionTitle}>Usuarios</Text>
                <Text style={styles.actionText}>Gestionar cuentas y roles.</Text>
              </View>
            </Link>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1 },
  inner: {
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  welcome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  welcomeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: { flex: 1, gap: 2 },
  title: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: {
    flex: 1,
    minWidth: 160,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: fontSize.sm, color: colors.textMuted },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  actionCard: {
    flex: 1,
    minWidth: 220,
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  actionText: { fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 20 },
});
