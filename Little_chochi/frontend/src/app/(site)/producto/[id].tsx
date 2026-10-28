import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProductImage } from '@/components/ProductImage';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Loading, ErrorBanner } from '@/components/ui/Feedback';
import { colors, spacing, fontSize, radius, maxContentWidth } from '@/styles/theme';
import { productsApi } from '@/modules/api/products';
import { formatPrice } from '@/modules/format';
import type { Producto } from '@/modules/types';

export default function ProductoDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await productsApi.get(id);
        if (active) {
          setProducto(res.data);
          setError(null);
        }
      } catch (e: any) {
        if (active) setError(e?.message || 'No se pudo cargar el producto');
      } finally {
        if (active) setCargando(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (cargando) {
    return (
      <View style={styles.center}>
        <Loading mensaje="Cargando producto…" />
      </View>
    );
  }

  if (error || !producto) {
    return (
      <View style={styles.center}>
        <ErrorBanner mensaje={error || 'Producto no encontrado'} />
        <Button title="Volver al catálogo" variant="outline" onPress={() => router.push('/catalogo')} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
          <Text style={styles.backText}>Volver</Text>
        </Pressable>

        <View style={styles.card}>
          <ProductImage url={producto.imagen_url} style={styles.image} iconSize={48} />

          <View style={styles.details}>
            <View style={styles.badges}>
              <Badge text={producto.categoria} />
              {!producto.disponible ? (
                <Badge text="Sin stock" color={colors.danger} bg={colors.dangerSoft} />
              ) : (
                <Badge text="Disponible" color={colors.success} bg={colors.successSoft} />
              )}
              {producto.es_ejemplo ? <Badge text="Ejemplo" color={colors.warning} bg={colors.warningSoft} /> : null}
            </View>

            <Text style={styles.name}>{producto.nombre}</Text>
            <Text style={styles.price}>{formatPrice(producto.precio)}</Text>

            {producto.descripcion ? (
              <Text style={styles.description}>{producto.descripcion}</Text>
            ) : null}

            <View style={styles.contactBox}>
              <Text style={styles.contactText}>
                ¿Te gustó esta pieza? Escribinos y coordinamos la compra.
              </Text>
              <Link href={`/contacto?producto=${producto.id}`} asChild>
                <Button
                  title="Consultar por este producto"
                  icon="chatbubble-ellipses-outline"
                  style={styles.contactButton}
                />
              </Link>
            </View>
          </View>
        </View>
      </View>

      <Footer />
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  inner: {
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  backText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  card: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    maxWidth: 520,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  details: {
    flex: 1,
    minWidth: 280,
    padding: spacing.lg,
    gap: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },
  price: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    lineHeight: 24,
  },
  contactBox: {
    marginTop: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  contactText: {
    color: colors.text,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  contactButton: {
    alignSelf: 'flex-start',
  },
});
