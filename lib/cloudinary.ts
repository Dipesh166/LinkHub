import { v4 as uuidv4 } from 'uuid';

export const uploadToCloudinary = async (file: File, imageId?: string): Promise<{ url: string; public_id: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'linkhub_unsigned');
    
    // Use existing ID or generate new UUID
    const uuid = imageId || uuidv4();
    const public_id = `linkhub/${uuid}`;
    formData.append('public_id', public_id);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    if (data.secure_url) {
      return {
        url: data.secure_url,
        public_id: uuid // Return the UUID we used
      };
    }
    throw new Error('Upload failed: Missing secure_url');
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};