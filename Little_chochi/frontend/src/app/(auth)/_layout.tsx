import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';

export default function AuthLayout() {
  return (
    <View style={styles.root}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
