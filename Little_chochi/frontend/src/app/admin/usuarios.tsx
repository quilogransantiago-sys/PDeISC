import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Loading, EmptyState, ErrorBanner, FullScreenLoading } from '@/components/ui/Feedback';
import { colors, spacing, fontSize, radius, maxContentWidth } from '@/styles/theme';
import { useAuth } from '@/context/AuthContext';
import { usersApi } from '@/modules/api/users';
import type { Usuario } from '@/modules/types';

const ROLES = [
  { id: 1, nombre: 'admin' as const },
  { id: 2, nombre: 'editor' as const },
  { id: 3, nombre: 'cliente' as const },
];

export default function AdminUsuarios() {
  const { usuario: currentUser, initializing } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [actualizandoId, setActualizandoId] = useState<number | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (currentUser?.rol !== 'admin') return;
    let active = true;
    (async () => {
      try {
        const res = await usersApi.list();
        if (active) {
          setUsuarios(res.data);
          setError(null);
        }
      } catch (e: any) {
        if (active) setError(e?.message || 'No se pudieron cargar los usuarios');
      } finally {
        if (active) setCargando(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [currentUser, version]);

  if (initializing) return <FullScreenLoading />;
  if (!currentUser) return <Redirect href="/login" />;
  if (currentUser.rol !== 'admin') return <Redirect href="/admin" />;

  async function cambiarRol(user: Usuario, rol_id: number) {
    if (user.rol_id === rol_id) return;
    setActualizandoId(user.id);
    setError(null);
    try {
      await usersApi.updateRole(user.id, rol_id);
      setVersion((v) => v + 1);
    } catch (e: any) {
      setError(e?.message || 'No se pudo cambiar el rol');
    } finally {
      setActualizandoId(null);
    }
  }

  async function eliminar() {
    if (!confirmDeleteId) return;
    setEliminando(true);
    setError(null);
    try {
      await usersApi.remove(confirmDeleteId);
      setConfirmDeleteId(null);
      setVersion((v) => v + 1);
    } catch (e: any) {
      setError(e?.message || 'No se pudo eliminar el usuario');
      setConfirmDeleteId(null);
    } finally {
      setEliminando(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Usuarios</Text>
        <Text style={styles.subtitle}>Gestioná cuentas y roles de la tienda.</Text>

        {error ? <ErrorBanner mensaje={error} /> : null}

        {confirmDeleteId ? (
          <View style={styles.confirmBar}>
            <Text style={styles.confirmText}>¿Eliminar este usuario? Esta acción no se puede deshacer.</Text>
            <View style={styles.confirmActions}>
              <Button title="Cancelar" variant="ghost" onPress={() => setConfirmDeleteId(null)} />
              <Button title="Eliminar" variant="danger" onPress={eliminar} loading={eliminando} icon="trash-outline" />
            </View>
          </View>
        ) : null}

        {cargando ? (
          <Loading />
        ) : usuarios.length === 0 ? (
          <EmptyState title="No hay usuarios" mensaje="Todavía no se registraron cuentas." />
        ) : (
          <View style={styles.list}>
            {usuarios.map((u) => {
              const isSelf = u.id === currentUser.id;
              return (
                <View key={u.id} style={styles.row}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.info}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>{u.nombre}</Text>
                      {isSelf ? <Badge text="Vos" color={colors.secondaryDark} bg={colors.secondarySoft} /> : null}
                    </View>
                    <Text style={styles.email}>{u.email}</Text>
                    <View style={styles.roleRow}>
                      <Text style={styles.roleLabel}>Rol:</Text>
                      {ROLES.map((r) => {
                        const active = u.rol_id === r.id;
                        return (
                          <Pressable
                            key={r.id}
                            disabled={isSelf || actualizandoId === u.id}
                            onPress={() => cambiarRol(u, r.id)}
                            style={[styles.roleChip, active && styles.roleChipActive]}
                          >
                            <Text style={[styles.roleChipText, active && styles.roleChipTextActive]}>
                              {r.nombre}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Eliminar ${u.nombre}`}
                    disabled={isSelf}
                    onPress={() => setConfirmDeleteId(u.id)}
                    style={[styles.deleteBtn, isSelf && styles.disabled]}
                  >
                    <Ionicons name="trash-outline" size={20} color={isSelf ? colors.textMuted : colors.danger} />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1 },
  inner: { width: '100%', maxWidth: maxContentWidth, alignSelf: 'center', padding: spacing.lg, gap: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textMuted },
  confirmBar: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.md,
    gap: spacing.sm,
  },
  confirmText: { color: colors.danger, fontSize: fontSize.sm, fontWeight: '600' },
  confirmActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm },
  list: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: spacing.xs },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  name: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  email: { fontSize: fontSize.xs, color: colors.textMuted },
  roleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs },
  roleLabel: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600' },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleChipText: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600' },
  roleChipTextActive: { color: colors.textOnPrimary },
  deleteBtn: { padding: 8 },
  disabled: { opacity: 0.4 },
});
