import { useMemo } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Navbar } from '@/components/Navbar';
import { useTheme } from '@/context/ThemeContext';

export default function SiteLayout() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.root}>
      <Navbar />
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
