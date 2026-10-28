import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Link, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FullScreenLoading } from '@/components/ui/Feedback';
import { Footer } from '@/components/Footer';
import { colors, spacing, fontSize, radius } from '@/styles/theme';
import { useAuth } from '@/context/AuthContext';

export default function CuentaScreen() {
  const { usuario, initializing, logout } = useAuth();

  if (initializing) return <FullScreenLoading />;
  if (!usuario) return <Redirect href="/login" />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Mi cuenta</Text>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.primary} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{usuario.nombre}</Text>
            <Text style={styles.email}>{usuario.email}</Text>
            <Badge
              text={usuario.rol}
              color={usuario.rol === 'admin' ? colors.secondaryDark : colors.primaryDark}
              bg={usuario.rol === 'admin' ? colors.secondarySoft : colors.primarySoft}
            />
          </View>
        </View>

        {(usuario.rol === 'admin' || usuario.rol === 'editor') && (
          <Link href="/admin" asChild>
            <Button title="Ir al panel de administración" icon="settings-outline" />
          </Link>
        )}

        <Button title="Cerrar sesión" variant="outline" onPress={logout} icon="log-out-outline" />
      </View>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1 },
  inner: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: spacing.xs },
  name: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  email: { fontSize: fontSize.sm, color: colors.textMuted },
});
