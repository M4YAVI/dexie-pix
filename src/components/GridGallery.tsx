'use client';

import { GalleryImage, useGalleryImages } from '@/app/lib/db';
import { useOptimistic, useState } from 'react';
import ImageCard from './ImageCard';
import ImageDialog from './ImageDialog';

export default function GalleryGrid() {
  const images = useGalleryImages() || [];
  const [selectedImageId, setSelectedImageId] = useState<number | undefined>(
    undefined
  );

  // Optimistic UI updates
  const [optimisticImages, addOptimisticImage] = useOptimistic(
    images,
    (state, newImage: GalleryImage) => [...state, newImage]
  );

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {optimisticImages.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => setSelectedImageId(image.id)}
          />
        ))}
      </div>

      <ImageDialog
        imageId={selectedImageId}
        open={selectedImageId !== undefined}
        onOpenChange={(open) => {
          if (!open) setSelectedImageId(undefined);
        }}
      />
    </div>
  );
}
