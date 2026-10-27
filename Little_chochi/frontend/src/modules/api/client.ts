import { storage, storageKeys } from '../storage';

/**
 * Cliente HTTP de la API (fetch).
 * - Añade el header Authorization cuando hay token de acceso.
 * - Renueva el token de acceso automáticamente (una vez) si recibe 401.
 * - Convierte los errores del backend en mensajes comprensibles.
 */

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';

export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

/** Resuelve URLs relativas de imágenes subidas (`/uploads/...`) a absolutas. */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

export class ApiError extends Error {
  status: number;
  details?: { campo: string; mensaje: string }[];

  constructor(message: string, status: number, details?: { campo: string; mensaje: string }[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

let accessToken: string | null = null;
let refreshInFlight: Promise<boolean> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  formData?: FormData;
  auth?: boolean;
}

/** Intenta renovar la sesión con el refresh token guardado. */
async function attemptRefresh(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = await storage.getItem(storageKeys.REFRESH_KEY);
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      accessToken = data.accessToken;
      await storage.setItem(storageKeys.ACCESS_KEY, data.accessToken);
      await storage.setItem(storageKeys.REFRESH_KEY, data.refreshToken);
      await storage.setItem(storageKeys.USER_KEY, JSON.stringify(data.usuario));
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function doRequest<T>(path: string, options: RequestOptions, retried = false): Promise<T> {
  const { method = 'GET', body, formData, auth = true } = options;

  const headers: Record<string, string> = {};
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let payload: BodyInit | undefined;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: payload,
  });

  // Renovación automática ante token de acceso vencido (una única vez).
  // El middleware de auth rechaza la petición antes de ejecutar el controller,
  // por lo que reintentar tras renovar es seguro para cualquier método.
  if (res.status === 401 && auth && !retried) {
    const renewed = await attemptRefresh();
    if (renewed) {
      return doRequest<T>(path, options, true);
    }
  }

  return parseResponse<T>(res);
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: any = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!res.ok) {
    throw new ApiError(
      data?.error || 'Ocurrió un error inesperado',
      res.status,
      data?.details,
    );
  }
  return data as T;
}

export const api = {
  get<T>(path: string, auth = true) {
    return doRequest<T>(path, { method: 'GET', auth });
  },
  post<T>(path: string, body?: unknown, auth = true) {
    return doRequest<T>(path, { method: 'POST', body, auth });
  },
  put<T>(path: string, body?: unknown, auth = true) {
    return doRequest<T>(path, { method: 'PUT', body, auth });
  },
  patch<T>(path: string, body?: unknown, auth = true) {
    return doRequest<T>(path, { method: 'PATCH', body, auth });
  },
  delete<T>(path: string, auth = true) {
    return doRequest<T>(path, { method: 'DELETE', auth });
  },
  upload<T>(path: string, formData: FormData) {
    return doRequest<T>(path, { method: 'POST', formData, auth: true });
  },
};
