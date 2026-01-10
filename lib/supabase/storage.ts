import { createClient } from '@/lib/supabase/client';

export async function uploadImage(file: File, bucket: string) {
  const supabase = createClient();
  
  // Create a unique file name to avoid overwriting
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  // Return the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}