import { api } from './client';

/** Sube una imagen de producto y devuelve su URL relativa. */
export async function uploadImage(file: { uri: string; name?: string; type?: string }): Promise<string> {
  const formData = new FormData();

  // En web `uri` es un blob/objectURL; en native es una ruta local.
  const fileObject: any = {
    uri: file.uri,
    name: file.name || `producto-${Date.now()}.jpg`,
    type: file.type || 'image/jpeg',
  };
  formData.append('archivo', fileObject);

  const res = await api.upload<{ ok: boolean; data: { url: string } }>('/uploads', formData);
  return res.data.url;
}
