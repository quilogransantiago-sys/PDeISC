/**
 * Tema visual de Little Chochi.
 * Paleta derivada del logotipo real (analizada con Pillow):
 *   - Crema de fondo  #EEE3DF
 *   - Verde azulado   #1A92A6
 *   - Coral           #E37369
 *   - Celeste suave   #A4BCE8
 *   - Amarillo suave  #F5C159
 */

export const colors = {
  primary: '#1A92A6',
  primaryDark: '#157687',
  primarySoft: '#E3F3F6',

  secondary: '#E37369',
  secondaryDark: '#C95B51',
  secondarySoft: '#FBEBE9',

  accent: '#F5C159',
  accentSoft: '#FBF0D6',

  softBlue: '#A4BCE8',
  softBlueDark: '#5B7FC0',

  cream: '#EEE3DF',
  background: '#FAF4F1',
  surface: '#FFFFFF',

  text: '#4A3F3B',
  textMuted: '#8A7E78',
  textOnPrimary: '#FFFFFF',

  border: '#E8DBD4',
  danger: '#C0392B',
  dangerSoft: '#FBECEA',
  success: '#2E8B57',
  successSoft: '#E7F4EC',
  warning: '#B97A1E',
  warningSoft: '#FBF0D6',

  overlay: 'rgba(74, 63, 59, 0.45)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 34,
};

export const shadows = {
  card: {
    shadowColor: '#4A3F3B',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
};

/** Ancho máximo del contenido en pantallas grandes (web). */
export const maxContentWidth = 1160;

/** Degradados para botones y secciones destacadas. */
export const gradients = {
  hero: ['#FFF6F0', '#F6E9E3'] as const,
  primary: ['#1FA6BB', '#157687'] as const,
  coral: ['#EB8A80', '#D05B50'] as const,
  warm: ['#F8CD72', '#E9A23B'] as const,
  soft: ['#FFFFFF', '#F3EAE6'] as const,
};

/** Enlaces a redes sociales de la marca. */
export const social = {
  facebook: 'https://facebook.com/littlechochi',
  instagram: 'https://instagram.com/littlechochi',
  whatsappNumber: '5491100000000',
};

/** Duración de las animaciones (ms). */
export const motion = {
  fast: 200,
  base: 350,
  slow: 550,
};
