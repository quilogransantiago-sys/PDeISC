import { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Linking, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/Feedback';
import { colors, spacing, fontSize, radius } from '@/styles/theme';
import { contactApi } from '@/modules/api/contact';

const WHATSAPP = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER;

export default function ContactoScreen() {
  const { producto } = useLocalSearchParams<{ producto?: string }>();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errors, setErrors] = useState<{ nombre?: string; email?: string; mensaje?: string }>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validar() {
    const next: typeof errors = {};
    if (nombre.trim().length < 2) next.nombre = 'Ingresá tu nombre';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Ingresá un email válido';
    if (mensaje.trim().length < 5) next.mensaje = 'El mensaje debe tener al menos 5 caracteres';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function enviar() {
    if (!validar()) return;
    setEnviando(true);
    setError(null);
    try {
      await contactApi.send({
        nombre: nombre.trim(),
        email: email.trim(),
        mensaje: mensaje.trim(),
        producto_id: producto ? Number(producto) : undefined,
      });
      setEnviado(true);
      setNombre('');
      setEmail('');
      setMensaje('');
    } catch (e: any) {
      setError(e?.message || 'No se pudo enviar el mensaje. Intentalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Contactanos</Text>
        <Text style={styles.subtitle}>
          Dejanos tu consulta y te respondemos a la brevedad.
          {producto ? ' (consulta sobre un producto)' : ''}
        </Text>

        {enviado ? (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={30} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>¡Mensaje enviado!</Text>
            <Text style={styles.successText}>
              Gracias por escribirnos. Te vamos a responder por correo.
            </Text>
            <Button title="Enviar otro mensaje" variant="outline" onPress={() => setEnviado(false)} />
          </View>
        ) : (
          <View style={styles.form}>
            {error ? <ErrorBanner mensaje={error} /> : null}

            <Input
              label="Nombre"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre"
              error={errors.nombre}
            />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="tucorreo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <Input
              label="Mensaje"
              value={mensaje}
              onChangeText={setMensaje}
              placeholder="Contanos qué necesitás…"
              multiline
              error={errors.mensaje}
            />
            <Button title="Enviar mensaje" onPress={enviar} loading={enviando} icon="send-outline" />
          </View>
        )}

        {WHATSAPP ? (
          <View style={styles.whatsappBox}>
            <Ionicons name="logo-whatsapp" size={22} color={colors.success} />
            <Text style={styles.whatsappText}>¿Preferís escribir por WhatsApp?</Text>
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola Little Chochi, quiero hacer una consulta')}`,
                )
              }
            >
              <Text style={styles.whatsappLink}>Abrir WhatsApp</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
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
  subtitle: { fontSize: fontSize.md, color: colors.textMuted },
  form: {
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  successCard: {
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  successText: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center' },
  whatsappBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    backgroundColor: colors.successSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  whatsappText: { color: colors.text, fontSize: fontSize.sm, flex: 1 },
  whatsappLink: { color: colors.success, fontWeight: '700', fontSize: fontSize.sm },
});
