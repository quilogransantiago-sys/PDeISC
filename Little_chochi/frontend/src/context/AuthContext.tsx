import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '@/modules/api/auth';
import { setAccessToken } from '@/modules/api/client';
import { storage, storageKeys } from '@/modules/storage';
import type { Usuario } from '@/modules/types';

interface AuthContextValue {
  usuario: Usuario | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    nombre: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  socialLogin: (
    proveedor: 'google' | 'facebook' | 'github',
    token?: string,
    code?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [initializing, setInitializing] = useState(true);

  const clearSession = useCallback(async () => {
    setAccessToken(null);
    setUsuario(null);
    await Promise.all([
      storage.removeItem(storageKeys.ACCESS_KEY),
      storage.removeItem(storageKeys.REFRESH_KEY),
      storage.removeItem(storageKeys.USER_KEY),
    ]);
  }, []);

  const persistSession = useCallback(
    async (data: { usuario: Usuario; accessToken: string; refreshToken: string }) => {
      setAccessToken(data.accessToken);
      setUsuario(data.usuario);
      await storage.setItem(storageKeys.ACCESS_KEY, data.accessToken);
      await storage.setItem(storageKeys.REFRESH_KEY, data.refreshToken);
      await storage.setItem(storageKeys.USER_KEY, JSON.stringify(data.usuario));
    },
    [],
  );

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const token = await storage.getItem(storageKeys.ACCESS_KEY);
        const refreshToken = await storage.getItem(storageKeys.REFRESH_KEY);
        const userJson = await storage.getItem(storageKeys.USER_KEY);

        if (token) setAccessToken(token);
        if (userJson) {
          try {
            setUsuario(JSON.parse(userJson));
          } catch {
            // usuario corrupto, se ignora
          }
        }

        if (token || refreshToken) {
          try {
            const res = await authApi.me();
            if (active) {
              setUsuario(res.usuario);
              await storage.setItem(storageKeys.USER_KEY, JSON.stringify(res.usuario));
            }
          } catch {
            if (active) await clearSession();
          }
        }
      } finally {
        if (active) setInitializing(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [clearSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      await persistSession(res);
    },
    [persistSession],
  );

  const register = useCallback(
    async (nombre: string, email: string, password: string, confirmPassword: string) => {
      const res = await authApi.register(nombre, email, password, confirmPassword);
      await persistSession(res);
    },
    [persistSession],
  );

  const socialLogin = useCallback(
    async (proveedor: 'google' | 'facebook' | 'github', token?: string, code?: string) => {
      const res = await authApi.social(proveedor, token, code);
      await persistSession(res);
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    const refreshToken = await storage.getItem(storageKeys.REFRESH_KEY);
    try {
      await authApi.logout(refreshToken);
    } catch {
      // ignoramos errores al cerrar sesión (se limpia localmente igual)
    }
    await clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({ usuario, initializing, login, register, socialLogin, logout }),
    [usuario, initializing, login, register, socialLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
}
