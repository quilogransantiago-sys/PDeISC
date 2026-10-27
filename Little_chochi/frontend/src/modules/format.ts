/** Utilidades de formato. */

const precioFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formatea un precio en pesos argentinos, p. ej. `$ 4.500`. */
export function formatPrice(value: number): string {
  if (Number.isNaN(value)) return '$ —';
  return precioFormatter.format(value);
}

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
