import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '@/styles/theme';

export type Mode = 'light' | 'dark';

interface ThemeContextValue {
  mode: Mode;
  colors: typeof lightColors;
  toggle: () => void;
  setMode: (m: Mode) => void;
}

const THEME_KEY = 'little_chochi:theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<Mode>('light');

  // Al montar, restauramos la preferencia guardada; si no hay, seguimos al sistema.
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') {
          setModeState(saved);
        } else if (system === 'dark') {
          setModeState('dark');
        }
      } catch {
        // sin storage, usamos el modo claro
      }
    })();
  }, [system]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    AsyncStorage.setItem(THEME_KEY, m).catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(THEME_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const colors = mode === 'dark' ? darkColors : lightColors;

  const value = useMemo(() => ({ mode, colors, toggle, setMode }), [mode, colors, toggle, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  }
  return ctx;
}
