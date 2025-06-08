'use client';

import { deleteImage } from '@/app/lib/actions';
import { db, useGalleryImage } from '@/app/lib/db';
import { formatDate, generateObjectURL } from '@/app/lib/utils';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';

interface ImageDialogProps {
  imageId: number | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImageDialog({
  imageId,
  open,
  onOpenChange,
}: ImageDialogProps) {
  const image = useGalleryImage(imageId);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (image?.file) {
      const url = generateObjectURL(image.file);
      setImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [image]);

  const handleDelete = async () => {
    if (!imageId) return;

    // Optimistically close the dialog
    onOpenChange(false);

    // Call the server action
    await deleteImage(imageId);

    // Delete from Dexie
    await db.images.delete(imageId);
  };

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{image.title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 rounded-lg overflow-hidden bg-white/5">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={image.title}
              className="w-full h-auto max-h-[60vh] object-contain"
            />
          )}
        </div>

        <div className="mt-4">
          <p className="text-white/70 whitespace-pre-line">{image.content}</p>
          <p className="text-white/50 text-sm mt-4">
            Added on {formatDate(image.createdAt)}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-1"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
