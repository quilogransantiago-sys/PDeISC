import { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
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
        if (active) setTotales({ productos: prods.data.length, categorias: cats.data.length, usuarios });
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
    { label: 'Productos', value: totales.productos, icon: 'grid-outline' as const },
    { label: 'Categorías', value: totales.categorias, icon: 'pricetags-outline' as const },
    ...(totales.usuarios !== null
      ? [{ label: 'Usuarios', value: totales.usuarios, icon: 'people-outline' as const }]
      : []),
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Panel de administración</Text>
        <Text style={styles.subtitle}>
          Hola {usuario?.nombre}. Acá gestionás el contenido de la tienda.
        </Text>

        {error ? <ErrorBanner mensaje={error} /> : null}

        {cargando ? (
          <Loading />
        ) : (
          <View style={styles.statsGrid}>
            {stats.map((s) => (
              <View key={s.label} style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Ionicons name={s.icon} size={24} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Link href="/admin/productos" asChild>
            <Button title="Gestionar productos" icon="grid-outline" />
          </Link>
          {usuario?.rol === 'admin' ? (
            <Link href="/admin/usuarios" asChild>
              <Button title="Gestionar usuarios" variant="outline" icon="people-outline" />
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
    gap: spacing.md,
  },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textMuted },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: fontSize.sm, color: colors.textMuted },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
