import { api } from './client';

export interface ContactInput {
  nombre: string;
  email: string;
  mensaje: string;
  producto_id?: number;
}

export const contactApi = {
  send(input: ContactInput) {
    return api.post<{ ok: boolean; mensaje: string; id: number }>('/contact', input, false);
  },
};
