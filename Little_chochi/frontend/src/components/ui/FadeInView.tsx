import { useEffect, useState, type ReactNode } from 'react';
import { Animated, type ViewStyle } from 'react-native';

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  style?: ViewStyle;
}

/** Envuelve contenido con un fade-in + desplazamiento suave al montarse. */
export function FadeInView({ children, delay = 0, style }: FadeInViewProps) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(14));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 420, delay, useNativeDriver: false }),
      Animated.timing(translateY, { toValue: 0, duration: 420, delay, useNativeDriver: false }),
    ]).start();
  }, [opacity, translateY, delay]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
