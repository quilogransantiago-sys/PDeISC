import { Image } from 'expo-image';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@/styles/theme';

const logoAsset = require('@/assets/images/logo.jpeg');

interface LogoProps {
  /** Alto (y ancho) de la imagen, en px. */
  size?: number;
  withText?: boolean;
  style?: ViewStyle;
}

/** Logotipo real de Little Chochi. Respeta sus proporciones (cuadrado). */
export function Logo({ size = 40, withText = false, style }: LogoProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
        <Image
          source={logoAsset}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          accessibilityLabel="Logotipo de Little Chochi"
        />
      </View>
      {withText ? (
        <Text style={[styles.wordmark, { fontSize: Math.max(size * 0.5, 18) }]}>
          Little Chochi
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordmark: {
    color: colors.text,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
