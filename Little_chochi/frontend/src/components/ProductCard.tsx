import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { ProductImage } from './ProductImage';
import { Badge } from './ui/Badge';
import { colors, radius, spacing, fontSize, shadows } from '@/styles/theme';
import { formatPrice } from '@/modules/format';
import type { Producto } from '@/modules/types';

export function ProductCard({ product }: { product: Producto }) {
  return (
    <Link href={`/producto/${product.id}`} asChild>
      <Pressable accessibilityRole="button" style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <ProductImage url={product.imagen_url} style={styles.image} />
        <View style={styles.body}>
          <View style={styles.topRow}>
            <Badge text={product.categoria} />
            {!product.disponible ? <Badge text="Sin stock" color={colors.danger} bg={colors.dangerSoft} /> : null}
          </View>
          <Text style={styles.name} numberOfLines={2}>
            {product.nombre}
          </Text>
          <Text style={styles.price}>{formatPrice(product.precio)}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    minHeight: 42,
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.primaryDark,
  },
});
