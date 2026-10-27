/** Tipos compartidos entre el frontend y la API. */

export type Rol = 'admin' | 'editor' | 'cliente';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  activo?: boolean;
  rol_id?: number;
  creado_en?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string | null;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  imagen_url?: string | null;
  disponible: boolean;
  es_ejemplo: boolean;
  creado_en?: string;
  actualizado_en?: string;
  categoria_id: number;
  categoria: string;
  categoria_slug: string;
}

export interface AuthResponse {
  ok: boolean;
  usuario: Usuario;
  accessToken: string;
  refreshToken: string;
}

export interface ApiListResponse<T> {
  ok: boolean;
  data: T[];
}
