'use client';

import { addImage } from '@/app/lib/actions';
import { db } from '@/app/lib/db';
import { AnimatePresence, motion } from 'framer-motion';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';

export default function UploadForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (formData: FormData) => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Server-side validation and processing
      const result = await addImage(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success) {
        // Add to Dexie DB (client-side)
        await db.images.add({
          title: result.data.title,
          content: result.data.content,
          file: selectedFile,
          createdAt: new Date(),
        });

        // Reset the form
        resetForm();
      }
    } catch (err) {
      console.error('Error adding image:', err);
      setError('Failed to upload image');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 mb-10">
      <h2 className="text-xl font-semibold text-white mb-4">Add New Image</h2>

      <form action={handleSubmit} className="space-y-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white/70 mb-1"
              >
                Title
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a title"
                required
                minLength={2}
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-white/70 mb-1"
              >
                Description
              </label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write something about this image..."
                rows={5}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-white/70 mb-1">
              Image
            </label>

            <AnimatePresence mode="wait">
              {!previewUrl ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-2 border-dashed border-white/20 rounded-lg h-52 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-10 w-10 text-white/40 mb-2" />
                  <p className="text-white/60 text-sm">
                    Click to select an image
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative h-52"
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                      resetForm();
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 text-sm text-white">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !selectedFile}
            className="flex items-center gap-2"
          >
            {isSubmitting ? 'Adding...' : 'Add to Gallery'}
            <Upload size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
}
