import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  isLoading?: boolean;
}

export function FileUploader({
  onFileSelect,
  selectedFile,
  onClear,
  isLoading,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const trySelectFile = useCallback(
    (next: File) => {
      if (!next.type.startsWith('image/')) {
        setError('Please upload an image file (JPEG, PNG).');
        return;
      }
      setError(null);
      onFileSelect(next);
    },
    [onFileSelect],
  );

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const f = e.dataTransfer.files?.[0];
      if (f) trySelectFile(f);
    },
    [trySelectFile],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) trySelectFile(f);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <label
          className={`relative flex flex-col items-center justify-center w-full min-h-[220px] rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
            ${
              dragActive
                ? 'border-clinical-500 bg-clinical-50 scale-[0.995]'
                : 'border-clinical-200 bg-gradient-to-b from-white to-clinical-50/40 hover:bg-clinical-50/60 hover:border-clinical-400'
            }
            ${error ? 'border-red-400 bg-red-50/80' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <div
              className={`p-4 rounded-2xl mb-4 transition-colors ${
                dragActive
                  ? 'bg-clinical-200/80 text-clinical-800'
                  : 'bg-surgical-50 text-surgical-600 shadow-inner'
              }`}
            >
              <Upload className="w-8 h-8" />
            </div>
            <p className="mb-2 text-lg font-medium text-slate-800">
              <span className="font-bold text-clinical-700">Click to upload</span>{' '}
              or drag and drop
            </p>
            <p className="text-sm text-slate-500">
              Chest X-ray (JPEG, PNG) — max 10 MB
            </p>
            {error && (
              <p className="mt-4 text-sm font-medium text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </p>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
          />
        </label>
      ) : (
        <div className="relative w-full overflow-hidden bg-white border border-clinical-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-clinical-100 shrink-0 ring-2 ring-clinical-200/80">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 truncate">
                {selectedFile.name}
              </h4>
              <p className="text-xs text-slate-500 mb-2">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-clinical-700">
                <CheckCircle className="w-4 h-4 shrink-0" /> Ready for analysis
              </div>
            </div>
            <Button
              variant="secondary"
              className="!p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
              onClick={onClear}
              disabled={isLoading}
              type="button"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
