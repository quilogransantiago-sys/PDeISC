import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { resolveMediaUrl } from '@/modules/api/client';
import { useTheme } from '@/context/ThemeContext';

interface ProductImageProps {
  url?: string | null;
  style?: ViewStyle;
  iconSize?: number;
}

/** Imagen de producto con estado de carga y placeholder ante error/sin imagen. */
export function ProductImage({ url, style, iconSize = 30 }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const resolved = resolveMediaUrl(url);

  if (!resolved || failed) {
    return (
      <View style={[styles.wrapper, styles.placeholder, style]}>
        <Ionicons name="image-outline" size={iconSize} color={colors.textMuted} />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, style]}>
      <Image
        source={{ uri: resolved }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={180}
        onError={() => setFailed(true)}
        accessibilityLabel="Imagen del producto"
      />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  wrapper: {
    backgroundColor: colors.cream,
    overflow: 'hidden',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
