'use client';

import { GalleryImage } from '@/app/lib/db';
import { generateObjectURL } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ImageCardProps {
  image: GalleryImage;
  onClick: () => void;
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = generateObjectURL(image.file);
    setImageUrl(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [image.file]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md h-[280px] group cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>
      )}
    </motion.div>
  );
}
