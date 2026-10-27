import { useState } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '@/components/Logo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/Feedback';
import { colors, spacing, fontSize, radius } from '@/styles/theme';
import { useAuth } from '@/context/AuthContext';

type Proveedor = 'google' | 'facebook' | 'github';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleLogin() {
    setError(null);
    setInfo(null);
    if (!email.trim() || !password) {
      setError('Ingresá tu email y contraseña');
      return;
    }
    setCargando(true);
    try {
      await login(email.trim(), password);
      router.replace('/cuenta');
    } catch (e: any) {
      setError(e?.message || 'No se pudo iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  function handleSocial(proveedor: Proveedor) {
    setError(null);
    setInfo(
      `El inicio de sesión con ${proveedor} requiere configurar las credenciales del proveedor (ver guía de instalación). Usá email y contraseña para probar la app.`,
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Logo size={64} />
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Bienvenido de nuevo a Little Chochi</Text>
        </View>

        {error ? <ErrorBanner mensaje={error} /> : null}
        {info ? (
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>{info}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="tucorreo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Tu contraseña"
            secureTextEntry
            autoComplete="current-password"
          />
          <Button title="Ingresar" onPress={handleLogin} loading={cargando} icon="log-in-outline" />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>o continuá con</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialRow}>
          <Pressable onPress={() => handleSocial('google')} style={styles.socialButton}>
            <Ionicons name="logo-google" size={22} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => handleSocial('facebook')} style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={22} color={colors.text} />
          </Pressable>
          <Pressable onPress={() => handleSocial('github')} style={styles.socialButton}>
            <Ionicons name="logo-github" size={22} color={colors.text} />
          </Pressable>
        </View>

        <Text style={styles.footer}>
          ¿No tenés cuenta?{' '}
          <Link href="/registro" style={styles.link}>
            Registrate
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    padding: 12,
  },
  infoText: { color: colors.primaryDark, fontSize: fontSize.xs, flex: 1, lineHeight: 18 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, fontSize: fontSize.xs },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  footer: { textAlign: 'center', color: colors.textMuted, fontSize: fontSize.sm },
  link: { color: colors.primaryDark, fontWeight: '700' },
});
