import { api } from './client';
import type { ApiListResponse, Usuario } from '../types';

export const usersApi = {
  list() {
    return api.get<ApiListResponse<Usuario>>('/users');
  },

  get(id: number | string) {
    return api.get<{ ok: boolean; data: Usuario }>(`/users/${id}`);
  },

  update(id: number | string, input: { nombre: string; email: string }) {
    return api.put<{ ok: boolean; data: Usuario }>(`/users/${id}`, input);
  },

  updateRole(id: number | string, rol_id: number) {
    return api.patch<{ ok: boolean; data: Usuario }>(`/users/${id}/role`, { rol_id });
  },

  remove(id: number | string) {
    return api.delete<{ ok: boolean; mensaje: string }>(`/users/${id}`);
  },
};
