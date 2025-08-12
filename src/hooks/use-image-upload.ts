import { useCallback, useEffect, useRef, useState } from "react";

interface UseImageUploadProps {
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  initialUrl?: string;
}

export function useImageUpload({ onUpload, onRemove, initialUrl }: UseImageUploadProps = {}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(initialUrl || null);
  }, [initialUrl]);

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onUpload?.(file);
      }
    },
    [onUpload, previewUrl],
  );

  const handleRemove = useCallback(() => {
    if (previewUrl && !initialUrl) { // Only revoke if it's a blob URL
        const isBlobUrl = previewUrl.startsWith('blob:');
        if (isBlobUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  }, [previewUrl, onRemove, initialUrl]);

  useEffect(() => {
    // This effect handles cleanup when the component unmounts.
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    previewUrl,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  };
}
