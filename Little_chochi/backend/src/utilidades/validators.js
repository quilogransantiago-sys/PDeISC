import { z } from 'zod';

/**
 * Esquemas de validación de entrada (Zod).
 * Centralizan las reglas de negocio y devuelven mensajes en español.
 */

const email = z
  .string({ required_error: 'El email es obligatorio' })
  .trim()
  .toLowerCase()
  .email('Ingresá un email válido');

const passwordSchema = z
  .string({ required_error: 'La contraseña es obligatoria' })
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe incluir al menos una mayúscula')
  .regex(/[a-z]/, 'La contraseña debe incluir al menos una minúscula')
  .regex(/[0-9]/, 'La contraseña debe incluir al menos un número')
  .regex(
    /[^A-Za-z0-9]/,
    'La contraseña debe incluir al menos un carácter especial',
  );

export const registerSchema = z
  .object({
    nombre: z
      .string({ required_error: 'El nombre es obligatorio' })
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre es demasiado largo'),
    email,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email,
  password: z.string({ required_error: 'La contraseña es obligatoria' }),
});

export const socialLoginSchema = z
  .object({
    proveedor: z.enum(['google', 'facebook', 'github'], {
      errorMap: () => ({ message: 'Proveedor social no soportado' }),
    }),
    token: z.string().optional(),
    code: z.string().optional(),
  })
  .refine((data) => data.token || data.code, {
    message: 'Se requiere el token o el código del proveedor',
  });

export const refreshSchema = z.object({
  refreshToken: z.string({ required_error: 'El refresh token es obligatorio' }),
});

const precio = z.coerce
  .number({ invalid_type_error: 'El precio debe ser un número' })
  .positive('El precio debe ser mayor que 0')
  .max(999999999, 'El precio es demasiado grande');

export const productSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre es demasiado largo'),
  descripcion: z.string().trim().max(5000, 'La descripción es demasiado larga').optional().nullable(),
  precio,
  imagen_url: z.string().trim().max(500).optional().nullable(),
  disponible: z.coerce.boolean().optional().default(true),
  es_ejemplo: z.coerce.boolean().optional().default(false),
  categoria_id: z.coerce
    .number({ invalid_type_error: 'La categoría es obligatoria' })
    .int('La categoría es inválida')
    .positive('La categoría es obligatoria'),
});

export const categorySchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  slug: z
    .string()
    .trim()
    .min(2, 'El slug debe tener al menos 2 caracteres')
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'El slug solo admite minúsculas, números y guiones'),
  descripcion: z.string().trim().max(500).optional().nullable(),
});

export const contactSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100),
  email,
  mensaje: z
    .string({ required_error: 'El mensaje es obligatorio' })
    .trim()
    .min(5, 'El mensaje debe tener al menos 5 caracteres')
    .max(2000, 'El mensaje es demasiado largo'),
  producto_id: z.coerce.number().int().positive().optional().nullable(),
});

export const updateProfileSchema = z.object({
  nombre: z.string().trim().min(2).max(100).optional(),
  email,
});

export const updateRoleSchema = z.object({
  rol_id: z.coerce
    .number({ invalid_type_error: 'El rol es obligatorio' })
    .int()
    .positive(),
});
