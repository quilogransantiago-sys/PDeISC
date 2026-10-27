import { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/Logo';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/Button';
import { Loading, EmptyState } from '@/components/ui/Feedback';
import { colors, spacing, fontSize, radius, maxContentWidth } from '@/styles/theme';
import { productsApi } from '@/modules/api/products';
import { categoriesApi } from '@/modules/api/categories';
import type { Producto, Categoria } from '@/modules/types';

const BENEFICIOS = [
  { icon: 'heart-outline', title: 'Hecho a mano', text: 'Cada pieza se elabora con dedicación artesanal.' },
  { icon: 'leaf-outline', title: 'Materiales nobles', text: 'Algodón y lanas suaves para la piel del bebé.' },
  { icon: 'cube-outline', title: 'Envíos a todo el país', text: 'Coordinamos la entrega de tu pedido donde estés.' },
] as const;

export default function HomeScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const { width } = useWindowDimensions();
  const columns = width >= 1024 ? 4 : width >= 640 ? 2 : 1;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [prods, cats] = await Promise.all([
          productsApi.list(),
          categoriesApi.list(),
        ]);
        if (active) {
          setProductos(prods.data.slice(0, 8));
          setCategorias(cats.data);
        }
      } catch {
        // si el backend no responde, mostramos estado vacío sin romper la UI
      } finally {
        if (active) setCargando(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroText}>
            <Text style={styles.kicker}>Boutique artesanal para bebés</Text>
            <Text style={styles.heroTitle}>Piezas únicas, hechas con amor</Text>
            <Text style={styles.heroSubtitle}>
              Ropa, accesorios y decoración tejidos a mano para acompañar los primeros
              años de tu bebé.
            </Text>
            <View style={styles.heroActions}>
              <Link href="/catalogo" asChild>
                <Button title="Ver catálogo" icon="grid-outline" />
              </Link>
              <Link href="/contacto" asChild>
                <Button title="Contactanos" variant="outline" icon="chatbubble-ellipses-outline" />
              </Link>
            </View>
          </View>
          <View style={styles.heroImage}>
            <Logo size={220} />
          </View>
        </View>

        {/* Categorías */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <View style={styles.categoryGrid}>
            {categorias.map((cat) => (
              <Link key={cat.id} href={`/catalogo?categoria=${cat.slug}`} asChild>
                <View style={styles.categoryCard}>
                  <Text style={styles.categoryName}>{cat.nombre}</Text>
                </View>
              </Link>
            ))}
          </View>
        </View>

        {/* Productos destacados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Productos destacados</Text>
            <Link href="/catalogo" style={styles.seeAll}>
              Ver todos
            </Link>
          </View>

          {cargando ? (
            <Loading />
          ) : productos.length === 0 ? (
            <EmptyState
              title="Todavía no hay productos"
              mensaje="Pronto vas a encontrar piezas artesanales únicas."
            />
          ) : (
            <View style={[styles.grid, { gap: spacing.md }]}>
              {productos.map((producto) => (
                <View
                  key={producto.id}
                  style={{
                    width:
                      columns === 1
                        ? '100%'
                        : columns === 2
                          ? '48.5%'
                          : '23.5%',
                  }}
                >
                  <ProductCard product={producto} />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Beneficios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Por qué elegirnos</Text>
          <View style={styles.benefitsGrid}>
            {BENEFICIOS.map((b) => (
              <View key={b.title} style={styles.benefit}>
                <View style={styles.benefitIcon}>
                  <Ionicons name={b.icon} size={26} color={colors.primary} />
                </View>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
  },
  inner: {
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.xxl,
  },
  hero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xl,
  },
  heroText: {
    flex: 1,
    minWidth: 280,
    gap: spacing.md,
  },
  kicker: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: fontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 42,
  },
  heroSubtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    lineHeight: 24,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  heroImage: {
    flex: 1,
    minWidth: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },
  seeAll: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: fontSize.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryCard: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryName: {
    color: colors.text,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  benefit: {
    flex: 1,
    minWidth: 220,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  benefitIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  benefitTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  benefitText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
