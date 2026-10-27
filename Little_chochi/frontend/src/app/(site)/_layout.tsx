import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function SiteLayout() {
  return (
    <View style={styles.root}>
      <Navbar />
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      <Footer />
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
