import { useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Logo } from '@/components/Logo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/Feedback';
import { colors, spacing, fontSize, radius } from '@/styles/theme';
import { useAuth } from '@/context/AuthContext';

export default function RegistroScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  function validar() {
    const next: Record<string, string> = {};
    if (nombre.trim().length < 2) next.nombre = 'Ingresá tu nombre';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Ingresá un email válido';
    if (password.length < 8) next.password = 'Mínimo 8 caracteres';
    else if (!/[A-Z]/.test(password)) next.password = 'Debe incluir una mayúscula';
    else if (!/[a-z]/.test(password)) next.password = 'Debe incluir una minúscula';
    else if (!/[0-9]/.test(password)) next.password = 'Debe incluir un número';
    else if (!/[^A-Za-z0-9]/.test(password)) next.password = 'Debe incluir un carácter especial';
    if (password !== confirmPassword) next.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleRegister() {
    setError(null);
    if (!validar()) return;
    setCargando(true);
    try {
      await register(nombre.trim(), email.trim(), password, confirmPassword);
      router.replace('/cuenta');
    } catch (e: any) {
      if (e?.details) {
        const fromDetails: Record<string, string> = {};
        for (const d of e.details) fromDetails[d.campo] = d.mensaje;
        setErrors(fromDetails);
        setError(e.message);
      } else {
        setError(e?.message || 'No se pudo crear la cuenta');
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Logo size={64} />
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Sumate a la comunidad de Little Chochi</Text>
        </View>

        {error ? <ErrorBanner mensaje={error} /> : null}

        <View style={styles.form}>
          <Input label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Tu nombre" error={errors.nombre} />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="tucorreo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />
          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 8 caracteres"
            secureTextEntry
            error={errors.password}
          />
          <Input
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repetí la contraseña"
            secureTextEntry
            error={errors.confirmPassword}
          />
          <Button title="Crear cuenta" onPress={handleRegister} loading={cargando} icon="person-add-outline" />
        </View>

        <Text style={styles.footer}>
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" style={styles.link}>
            Iniciá sesión
          </Link>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  card: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
  },
  header: { alignItems: 'center', gap: spacing.sm },
  title: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted },
  form: { gap: spacing.md },
  footer: { textAlign: 'center', color: colors.textMuted, fontSize: fontSize.sm },
  link: { color: colors.primaryDark, fontWeight: '700' },
});
