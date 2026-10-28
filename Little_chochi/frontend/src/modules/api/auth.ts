import { api } from './client';
import type { AuthResponse, Usuario } from '../types';

export const authApi = {
  register(nombre: string, email: string, password: string, confirmPassword: string) {
    return api.post<AuthResponse>(
      '/auth/register',
      { nombre, email, password, confirmPassword },
      false,
    );
  },

  login(email: string, password: string) {
    return api.post<AuthResponse>('/auth/login', { email, password }, false);
  },

  logout(refreshToken: string | null) {
    return api.post<{ ok: boolean; mensaje: string }>(
      '/auth/logout',
      { refreshToken },
      false,
    );
  },

  me() {
    return api.get<{ ok: boolean; usuario: Usuario }>('/auth/me');
  },

  social(proveedor: 'google' | 'facebook' | 'github', token?: string, code?: string) {
    return api.post<AuthResponse>('/auth/social', { proveedor, token, code }, false);
  },
};
