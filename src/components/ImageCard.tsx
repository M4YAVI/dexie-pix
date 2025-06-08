'use client';

import { GalleryImage } from '@/app/lib/db';
import { generateObjectURL } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import { MouseEvent, useEffect, useRef, useState } from 'react';

interface ImageCardProps {
  image: GalleryImage;
  onClick: () => void;
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = generateObjectURL(image.file);
    setImageUrl(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [image.file]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const copyImage = async () => {
    if (!imageUrl) return;

    try {
      // Fetch the image as blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create ClipboardItem with the blob
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);

      // Show success feedback
      alert('Image copied to clipboard!');
      setShowContextMenu(false);
    } catch (err) {
      console.error('Failed to copy image:', err);
      // Fallback: open image in new tab
      window.open(imageUrl, '_blank');
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${image.title || 'image'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowContextMenu(false);
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md h-[280px] group cursor-pointer transform-gpu transition-transform duration-300 ease-out"
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onContextMenu={handleContextMenu}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.1)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          animate={{
            opacity: isHovered ? 0.6 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Glowing effect on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
            }}
          />
        )}

        {imageUrl && (
          <motion.div
            className="absolute inset-0 z-0"
            animate={{
              scale: isHovered ? 1.15 : 1,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <img
              src={imageUrl}
              alt={image.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>
        )}

        {/* Title overlay (optional) */}
        {image.title && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 z-20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-white text-lg font-semibold drop-shadow-lg">
              {image.title}
            </h3>
          </motion.div>
        )}
      </motion.div>

      {/* Context Menu */}
      {showContextMenu && (
        <motion.div
          ref={contextMenuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
          style={{
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
          }}
        >
          <button
            onClick={copyImage}
            className="block w-full px-4 py-2 text-left text-white hover:bg-gray-800 transition-colors duration-200"
          >
            📋 Copy Image
          </button>
          <button
            onClick={downloadImage}
            className="block w-full px-4 py-2 text-left text-white hover:bg-gray-800 transition-colors duration-200 border-t border-gray-700"
          >
            💾 Download Image
          </button>
          <button
            onClick={() => {
              window.open(imageUrl, '_blank');
              setShowContextMenu(false);
            }}
            className="block w-full px-4 py-2 text-left text-white hover:bg-gray-800 transition-colors duration-200 border-t border-gray-700"
          >
            🔗 Open in New Tab
          </button>
        </motion.div>
      )}
    </>
  );
}
