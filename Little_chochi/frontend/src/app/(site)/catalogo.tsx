import { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProductCard } from '@/components/ProductCard';
import { Loading, EmptyState, ErrorBanner } from '@/components/ui/Feedback';
import { colors, spacing, fontSize, radius, maxContentWidth } from '@/styles/theme';
import { productsApi } from '@/modules/api/products';
import { categoriesApi } from '@/modules/api/categories';
import type { Producto, Categoria } from '@/modules/types';

const ORDENES = [
  { value: '', label: 'Relevancia' },
  { value: 'nombre-desc', label: 'Nombre Z-A' },
  { value: 'precio-asc', label: 'Precio: menor' },
  { value: 'precio-desc', label: 'Precio: mayor' },
];

export default function CatalogoScreen() {
  const params = useLocalSearchParams<{ categoria?: string }>();
  const [buscar, setBuscar] = useState('');
  const [buscarDebounced, setBuscarDebounced] = useState('');
  const [categoria, setCategoria] = useState(params.categoria ?? '');
  const [orden, setOrden] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const columns = width >= 1024 ? 4 : width >= 640 ? 2 : 1;

  // Debounce de búsqueda
  useEffect(() => {
    const t = setTimeout(() => setBuscarDebounced(buscar), 300);
    return () => clearTimeout(t);
  }, [buscar]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const cats = await categoriesApi.list();
        if (active) setCategorias(cats.data);
      } catch {
        // sin categorías se sigue pudiendo listar productos
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await productsApi.list({
          buscar: buscarDebounced || undefined,
          categoria: categoria || undefined,
          orden: orden || undefined,
        });
        if (active) {
          setProductos(res.data);
          setError(null);
        }
      } catch (e: any) {
        if (active) setError(e?.message || 'No se pudieron cargar los productos');
      } finally {
        if (active) setCargando(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [buscarDebounced, categoria, orden]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Catálogo</Text>
        <Text style={styles.subtitle}>
          Encontrá la pieza perfecta para tu bebé.
        </Text>

        {/* Búsqueda */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            value={buscar}
            onChangeText={setBuscar}
            placeholder="Buscar por nombre…"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
          {buscar ? (
            <Pressable onPress={() => setBuscar('')} accessibilityLabel="Limpiar búsqueda">
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Filtros de categoría */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Pressable
            onPress={() => setCategoria('')}
            style={[styles.chip, categoria === '' && styles.chipActive]}
          >
            <Text style={[styles.chipText, categoria === '' && styles.chipTextActive]}>
              Todas
            </Text>
          </Pressable>
          {categorias.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => setCategoria(cat.slug)}
              style={[styles.chip, categoria === cat.slug && styles.chipActive]}
            >
              <Text style={[styles.chipText, categoria === cat.slug && styles.chipTextActive]}>
                {cat.nombre}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Orden */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {ORDENES.map((o) => (
            <Pressable
              key={o.value}
              onPress={() => setOrden(o.value)}
              style={[styles.chip, styles.orderChip, orden === o.value && styles.chipActive]}
            >
              <Ionicons
                name="swap-vertical"
                size={14}
                color={orden === o.value ? colors.textOnPrimary : colors.textMuted}
              />
              <Text style={[styles.chipText, orden === o.value && styles.chipTextActive]}>
                {o.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {error ? <ErrorBanner mensaje={error} /> : null}

        {/* Resultados */}
        {cargando ? (
          <Loading />
        ) : productos.length === 0 ? (
          <EmptyState
            title="Sin resultados"
            mensaje="No encontramos productos con esos filtros. Probá con otros términos."
            icon="search-outline"
          />
        ) : (
          <View style={styles.grid}>
            {productos.map((producto) => (
              <View
                key={producto.id}
                style={{
                  width: columns === 1 ? '100%' : columns === 2 ? '48.5%' : '23.5%',
                }}
              >
                <ProductCard product={producto} />
              </View>
            ))}
          </View>
        )}
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
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
  },
  chips: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  chipTextActive: {
    color: colors.textOnPrimary,
  },
  orderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});
