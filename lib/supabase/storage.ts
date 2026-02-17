// lib/supabase/storage.ts
import { createClient } from '@/supabase/client'; // Adjust path if needed

export const uploadImage = async (file: File, bucket: string = 'blog-images') => {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error, data } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};