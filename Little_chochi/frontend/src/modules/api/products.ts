import { api } from './client';
import type { ApiListResponse, Producto } from '../types';

export interface ProductFilters {
  buscar?: string;
  categoria?: string;
  orden?: string;
}

export interface ProductInput {
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  disponible: boolean;
  es_ejemplo: boolean;
  categoria_id: number;
}

export const productsApi = {
  list(filters: ProductFilters = {}) {
    const params = new URLSearchParams();
    if (filters.buscar) params.set('buscar', filters.buscar);
    if (filters.categoria) params.set('categoria', filters.categoria);
    if (filters.orden) params.set('orden', filters.orden);
    const qs = params.toString();
    return api.get<ApiListResponse<Producto>>(`/products${qs ? `?${qs}` : ''}`, false);
  },

  get(id: number | string) {
    return api.get<{ ok: boolean; data: Producto }>(`/products/${id}`, false);
  },

  create(input: ProductInput) {
    return api.post<{ ok: boolean; data: Producto }>('/products', input);
  },

  update(id: number | string, input: ProductInput) {
    return api.put<{ ok: boolean; data: Producto }>(`/products/${id}`, input);
  },

  remove(id: number | string) {
    return api.delete<{ ok: boolean; mensaje: string }>(`/products/${id}`);
  },
};
