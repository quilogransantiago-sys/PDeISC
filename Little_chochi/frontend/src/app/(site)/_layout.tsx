import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Navbar } from '@/components/Navbar';

export default function SiteLayout() {
  return (
    <View style={styles.root}>
      <Navbar />
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
