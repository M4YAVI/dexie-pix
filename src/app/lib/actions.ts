'use server';

import { revalidatePath } from 'next/cache';

export async function addImage(formData: FormData) {
  try {
    // In a real app, you'd upload to a storage service here
    // For this example, we'll use client-side Dexie storage

    // For server-side validation/processing
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title || title.length < 2) {
      return { error: 'Title is required and must be at least 2 characters' };
    }

    // Since we're using Dexie.js on the client,
    // we'll return validated data to be added on the client
    return {
      success: true,
      data: {
        title,
        content,
      },
    };
  } catch (error) {
    console.error('Failed to process image:', error);
    return { error: 'Failed to add image' };
  } finally {
    revalidatePath('/');
  }
}

export async function deleteImage(id: number) {
  try {
    // In a real app with a server database, you'd delete here
    // For this demo with Dexie, we'll handle actual deletion on the client
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete image:', error);
    return { error: 'Failed to delete image' };
  }
}
