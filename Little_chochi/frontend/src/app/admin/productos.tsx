import { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Switch,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ProductImage } from '@/components/ProductImage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loading, EmptyState, ErrorBanner } from '@/components/ui/Feedback';
import { colors, spacing, fontSize, radius, maxContentWidth } from '@/styles/theme';
import { productsApi, type ProductInput } from '@/modules/api/products';
import { categoriesApi } from '@/modules/api/categories';
import { uploadImage } from '@/modules/api/uploads';
import { formatPrice } from '@/modules/format';
import type { Producto, Categoria } from '@/modules/types';

interface FormState {
  nombre: string;
  descripcion: string;
  precio: string;
  categoria_id: number | null;
  imagen_url: string;
  disponible: boolean;
  es_ejemplo: boolean;
}

const emptyForm: FormState = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoria_id: null,
  imagen_url: '',
  disponible: true,
  es_ejemplo: false,
};

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [prods, cats] = await Promise.all([productsApi.list(), categoriesApi.list()]);
        if (active) {
          setProductos(prods.data);
          setCategorias(cats.data);
          setError(null);
        }
      } catch (e: any) {
        if (active) setError(e?.message || 'No se pudieron cargar los productos');
      } finally {
        if (active) setCargando(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [version]);

  function abrirNuevo() {
    setEditId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  }

  function abrirEditar(p: Producto) {
    setEditId(p.id);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion ?? '',
      precio: String(p.precio),
      categoria_id: p.categoria_id,
      imagen_url: p.imagen_url ?? '',
      disponible: p.disponible,
      es_ejemplo: p.es_ejemplo,
    });
    setFormError(null);
    setShowForm(true);
  }

  function cerrarForm() {
    setShowForm(false);
    setEditId(null);
    setFormError(null);
  }

  async function elegirImagen() {
    setFormError(null);
    try {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permiso.granted) {
        setFormError('Necesitás dar permiso para acceder a las fotos');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: true,
      });
      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      setSubiendo(true);
      try {
        const url = await uploadImage({
          uri: asset.uri,
          name: asset.fileName || asset.uri.split('/').pop(),
          type: asset.mimeType || 'image/jpeg',
        });
        setForm((f) => ({ ...f, imagen_url: url }));
      } finally {
        setSubiendo(false);
      }
    } catch (e: any) {
      setFormError(e?.message || 'No se pudo subir la imagen');
    }
  }

  async function guardar() {
    setFormError(null);
    const precio = Number(form.precio);
    if (form.nombre.trim().length < 2) {
      setFormError('Ingresá el nombre del producto');
      return;
    }
    if (!form.categoria_id) {
      setFormError('Elegí una categoría');
      return;
    }
    if (Number.isNaN(precio) || precio <= 0) {
      setFormError('Ingresá un precio válido mayor que 0');
      return;
    }

    const input: ProductInput = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || undefined,
      precio,
      categoria_id: form.categoria_id,
      imagen_url: form.imagen_url.trim() || undefined,
      disponible: form.disponible,
      es_ejemplo: form.es_ejemplo,
    };

    setGuardando(true);
    try {
      if (editId) {
        await productsApi.update(editId, input);
      } else {
        await productsApi.create(input);
      }
      cerrarForm();
      setVersion((v) => v + 1);
    } catch (e: any) {
      setFormError(e?.message || 'No se pudo guardar el producto');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar() {
    if (!confirmDeleteId) return;
    setEliminando(true);
    setError(null);
    try {
      await productsApi.remove(confirmDeleteId);
      setConfirmDeleteId(null);
      setVersion((v) => v + 1);
    } catch (e: any) {
      setError(e?.message || 'No se pudo eliminar el producto');
      setConfirmDeleteId(null);
    } finally {
      setEliminando(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>Productos</Text>
          <Button title="Nuevo producto" icon="add" onPress={abrirNuevo} />
        </View>

        {error ? <ErrorBanner mensaje={error} /> : null}

        {showForm ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{editId ? 'Editar producto' : 'Nuevo producto'}</Text>

            {formError ? <ErrorBanner mensaje={formError} /> : null}

            <View style={styles.formRow}>
              <Input
                label="Nombre"
                value={form.nombre}
                onChangeText={(v) => setForm((f) => ({ ...f, nombre: v }))}
                placeholder="Ej: Babero artesanal"
                containerStyle={styles.flexGrow}
              />
              <Input
                label="Precio (ARS)"
                value={form.precio}
                onChangeText={(v) => setForm((f) => ({ ...f, precio: v.replace(',', '.') }))}
                placeholder="4500"
                keyboardType="decimal-pad"
                containerStyle={styles.precioInput}
              />
            </View>

            <Input
              label="Descripción"
              value={form.descripcion}
              onChangeText={(v) => setForm((f) => ({ ...f, descripcion: v }))}
              placeholder="Describí el producto…"
              multiline
            />

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Categoría</Text>
              <View style={styles.chips}>
                {categorias.map((cat) => {
                  const active = form.categoria_id === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Categoría ${cat.nombre}`}
                      onPress={() => setForm((f) => ({ ...f, categoria_id: cat.id }))}
                      style={[styles.chip, active && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat.nombre}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Imagen</Text>
              <Input
                value={form.imagen_url}
                onChangeText={(v) => setForm((f) => ({ ...f, imagen_url: v }))}
                placeholder="URL de la imagen (o subí una foto)"
              />
              <View style={styles.uploadRow}>
                <Button
                  title={subiendo ? 'Subiendo…' : 'Subir imagen desde el dispositivo'}
                  variant="outline"
                  icon="cloud-upload-outline"
                  onPress={elegirImagen}
                  disabled={subiendo}
                />
                {form.imagen_url ? (
                  <ProductImage url={form.imagen_url} style={styles.preview} iconSize={20} />
                ) : null}
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.fieldLabel}>Disponible</Text>
              <Switch
                value={form.disponible}
                onValueChange={(v) => setForm((f) => ({ ...f, disponible: v }))}
                trackColor={{ true: colors.primary, false: colors.border }}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.fieldLabel}>Producto de ejemplo</Text>
              <Switch
                value={form.es_ejemplo}
                onValueChange={(v) => setForm((f) => ({ ...f, es_ejemplo: v }))}
                trackColor={{ true: colors.accent, false: colors.border }}
              />
            </View>

            <View style={styles.formActions}>
              <Button title="Cancelar" variant="ghost" onPress={cerrarForm} />
              <Button title={editId ? 'Guardar cambios' : 'Crear producto'} onPress={guardar} loading={guardando} icon="save-outline" />
            </View>
          </View>
        ) : null}

        {confirmDeleteId ? (
          <View style={styles.confirmBar}>
            <Text style={styles.confirmText}>¿Eliminar este producto? Esta acción no se puede deshacer.</Text>
            <View style={styles.confirmActions}>
              <Button title="Cancelar" variant="ghost" onPress={() => setConfirmDeleteId(null)} />
              <Button title="Eliminar" variant="danger" onPress={eliminar} loading={eliminando} icon="trash-outline" />
            </View>
          </View>
        ) : null}

        {cargando ? (
          <Loading />
        ) : productos.length === 0 ? (
          <EmptyState title="No hay productos" mensaje="Cargá el primer producto de la tienda." />
        ) : (
          <View style={styles.list}>
            {productos.map((p) => (
              <View key={p.id} style={styles.productRow}>
                <ProductImage url={p.imagen_url} style={styles.thumb} iconSize={22} />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{p.nombre}</Text>
                  <Text style={styles.rowMeta}>
                    {p.categoria} · {formatPrice(p.precio)}
                  </Text>
                  <View style={styles.rowBadges}>
                    {!p.disponible ? <Badge text="Sin stock" color={colors.danger} bg={colors.dangerSoft} /> : null}
                    {p.es_ejemplo ? <Badge text="Ejemplo" color={colors.warning} bg={colors.warningSoft} /> : null}
                  </View>
                </View>
                <View style={[styles.rowActions, isMobile && styles.rowActionsMobile]}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Editar ${p.nombre}`}
                    onPress={() => abrirEditar(p)}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="create-outline" size={20} color={colors.primary} />
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Eliminar ${p.nombre}`}
                    onPress={() => setConfirmDeleteId(p.id)}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </Pressable>
                </View>
              </View>
            ))}
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  formTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  formRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  flexGrow: { flex: 1, minWidth: 200 },
  precioInput: { width: 160 },
  field: { gap: spacing.xs },
  fieldLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontWeight: '600', fontSize: fontSize.sm },
  chipTextActive: { color: colors.textOnPrimary },
  uploadRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xs },
  preview: { width: 72, height: 72, borderRadius: radius.md },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, flexWrap: 'wrap' },
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
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  thumb: { width: 64, height: 64, borderRadius: radius.sm },
  rowInfo: { flex: 1, gap: 2 },
  rowName: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  rowMeta: { fontSize: fontSize.xs, color: colors.textMuted },
  rowBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  rowActions: { flexDirection: 'row', gap: spacing.xs },
  rowActionsMobile: { flexDirection: 'column', gap: spacing.xs },
  iconBtn: { padding: 8 },
});
