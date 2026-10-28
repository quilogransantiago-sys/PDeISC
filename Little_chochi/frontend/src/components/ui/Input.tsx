import { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Pressable,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, fontSize } from '@/styles/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  containerStyle?: ViewStyle;
  multiline?: boolean;
}

export function Input({ label, error, containerStyle, multiline, secureTextEntry, ...props }: InputProps) {
  const [hidden, setHidden] = useState(secureTextEntry === true);
  const esContrasena = secureTextEntry === true;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {esContrasena ? (
        <View style={[styles.passwordWrapper, error ? styles.inputError : null]}>
          <TextInput
            placeholderTextColor={colors.textMuted}
            style={styles.passwordInput}
            secureTextEntry={hidden}
            autoCapitalize="none"
            {...props}
          />
          <Pressable
            onPress={() => setHidden((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
            style={styles.eye}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        </View>
      ) : (
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            multiline && styles.multiline,
            error ? styles.inputError : null,
          ]}
          multiline={multiline}
          {...props}
        />
      )}

      {error ? (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: fontSize.md,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    fontSize: fontSize.md,
  },
  eye: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSize.xs,
  },
});
