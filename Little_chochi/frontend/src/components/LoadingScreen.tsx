import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { Logo } from './Logo';
import { colors, fontSize } from '@/styles/theme';

/** Pantalla de carga inicial con animación del logo. */
export function LoadingScreen() {
  const [opacity] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(0.9));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 550, useNativeDriver: false }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: false }),
    ]).start();
  }, [opacity, scale]);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.box, { opacity, transform: [{ scale }] }]}>
        <Logo size={96} />
        <Text style={styles.title}>Little Chochi</Text>
        <Text style={styles.subtitle}>Hecho a mano con amor</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});
