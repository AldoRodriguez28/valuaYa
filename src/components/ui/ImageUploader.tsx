import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, Loader2, Plus, Eye, X } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { Button } from './Button';

interface ImageUploaderProps {
  label?: string;
  helperText?: string;
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  single?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  helperText,
  images,
  onChange,
  maxImages = 6,
  single = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const newCompressedImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressedDataUrl = await compressImage(file);
        newCompressedImages.push(compressedDataUrl);

        if (single) break;
      }

      if (single) {
        onChange([newCompressedImages[0]]);
      } else {
        const updated = [...images, ...newCompressedImages].slice(0, maxImages);
        onChange(updated);
      }
    } catch (err) {
      console.error('Error compressing image:', err);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="space-y-2.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            {label}
          </label>
          <span className="text-[11px] text-slate-400">
            {single ? (images.length > 0 ? '1 / 1' : '0 / 1') : `${images.length} / ${maxImages}`}
          </span>
        </div>
      )}

      {/* Input hidden */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/webp"
        multiple={!single}
        className="hidden"
      />

      {/* Image Preview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-4/3 shadow-xs"
          >
            <img
              src={imgUrl}
              alt={`Foto ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => setActiveLightboxImage(imgUrl)}
            />
            <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveLightboxImage(imgUrl)}
                className="p-1 bg-slate-900/60 hover:bg-slate-900 text-white rounded-lg backdrop-blur-xs transition-colors"
                title="Ampliar foto"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="p-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg backdrop-blur-xs transition-colors"
                title="Eliminar foto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Upload Trigger Button Tile */}
        {((single && images.length === 0) || (!single && images.length < maxImages)) && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="min-h-[100px] aspect-4/3 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#1E3A8A] bg-slate-50/80 hover:bg-slate-100/80 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-slate-500 hover:text-[#1E3A8A]"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" />
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-xs font-semibold">
                  {single ? 'Subir Foto' : 'Agregar Fotos'}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeLightboxImage}
              alt="Ampliada"
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
