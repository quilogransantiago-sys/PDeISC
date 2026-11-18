import { Platform } from 'react-native';
import { api } from './client';

/** Sube una imagen de producto y devuelve su URL relativa. */
export async function uploadImage(file: { uri: string; name?: string; type?: string }): Promise<string> {
  const formData = new FormData();
  const name = file.name || `producto-${Date.now()}.jpg`;
  const type = file.type || 'image/jpeg';

  if (Platform.OS === 'web') {
    // En web, FormData necesita un Blob/File real. La URI de expo-image-picker
    // puede ser `blob:` o `data:`; la convertimos a Blob antes de adjuntarla.
    const blob = await (await fetch(file.uri)).blob();
    formData.append('archivo', blob, name);
  } else {
    // En native, FormData acepta un objeto { uri, name, type }.
    formData.append('archivo', { uri: file.uri, name, type } as any);
  }

  const res = await api.upload<{ ok: boolean; data: { url: string } }>('/uploads', formData);
  return res.data.url;
}

