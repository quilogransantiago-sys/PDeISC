import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Persistencia de sesión.
 * En dispositivos usa el almacenamiento sandbox de la app (AsyncStorage);
 * en web AsyncStorage usa localStorage como respaldo.
 *
 * Nota de seguridad: para una puesta en producción web se recomienda migrar
 * el refresh token a una cookie HttpOnly servida por el backend (ver docs).
 */

const ACCESS_KEY = 'little_chochi:accessToken';
const REFRESH_KEY = 'little_chochi:refreshToken';
const USER_KEY = 'little_chochi:usuario';

export const storageKeys = { ACCESS_KEY, REFRESH_KEY, USER_KEY };

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // ignoramos errores de persistencia en entornos sin storage
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // ignoramos
    }
  },
};
