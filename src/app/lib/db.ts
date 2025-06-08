import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

// Define the interface for our image items
export interface GalleryImage {
  id?: number;
  title: string;
  content: string;
  file: Blob;
  createdAt: Date;
}

// Create a Dexie database class
class GalleryDatabase extends Dexie {
  images!: Dexie.Table<GalleryImage, number>;

  constructor() {
    super('GalleryDatabase');
    this.version(1).stores({
      images: '++id, title, createdAt',
    });
  }
}

// Create a database instance
export const db = new GalleryDatabase();

// Hook to get all images
export function useGalleryImages() {
  return useLiveQuery(
    () => db.images.orderBy('createdAt').reverse().toArray(),
    []
  );
}

// Hook to get a single image by id
export function useGalleryImage(id: number | undefined) {
  return useLiveQuery(async () => {
    if (!id) return null;
    return await db.images.get(id);
  }, [id]);
}
