import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { colors } from '@/styles/theme';

// Necesario en web para cerrar la ventana emergente del login social (Google/Facebook/GitHub).
WebBrowser.maybeCompleteAuthSession();

function RootNavigator() {
  const { initializing } = useAuth();
  const [minSplash, setMinSplash] = useState(true);

  // Mostramos la pantalla de carga al menos 1,2 s para que se vea bien.
  useEffect(() => {
    const t = setTimeout(() => setMinSplash(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (initializing || minSplash) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}
