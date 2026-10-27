import { api } from './client';
import type { ApiListResponse, Categoria } from '../types';

export interface CategoryInput {
  nombre: string;
  slug: string;
  descripcion?: string;
}

export const categoriesApi = {
  list() {
    return api.get<ApiListResponse<Categoria>>('/categories', false);
  },

  create(input: CategoryInput) {
    return api.post<{ ok: boolean; data: Categoria }>('/categories', input);
  },

  update(id: number | string, input: CategoryInput) {
    return api.put<{ ok: boolean; data: Categoria }>(`/categories/${id}`, input);
  },

  remove(id: number | string) {
    return api.delete<{ ok: boolean; mensaje: string }>(`/categories/${id}`);
  },
};
