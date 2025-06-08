import GalleryGrid from '@/components/GridGallery';
import { Suspense } from 'react';

export default function Gallery() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="text-white/60 text-center py-20">
            Loading gallery...
          </div>
        }
      >
        <GalleryGrid />
      </Suspense>
    </div>
  );
}
