"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  folder: string;
  currentUrl?: string;
  onUpload: (key: string, proxyUrl: string) => void;
  onRemove: () => void;
  className?: string;
  aspectRatio?: "square" | "landscape" | "portrait";
};

export function ImageUpload({
  folder,
  currentUrl,
  onUpload,
  onRemove,
  className,
  aspectRatio = "landscape",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClass = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[3/4]",
  }[aspectRatio];

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten archivos de imagen");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("El archivo no puede exceder 5MB");
        return;
      }

      setError(null);
      setUploading(true);
      setProgress(10);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folder,
            filename: file.name,
            contentType: file.type,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al preparar la subida");
        }

        const { url, fields, key } = await res.json();
        setProgress(30);

        const formData = new FormData();
        Object.entries(fields).forEach(([k, v]) => {
          formData.append(k, v as string);
        });
        formData.append("Content-Type", file.type);
        formData.append("file", file);

        setProgress(50);

        const uploadRes = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok && uploadRes.status !== 204) {
          throw new Error("Error al subir el archivo");
        }

        setProgress(100);
        const proxyUrl = `/api/images/${encodeURIComponent(key)}`;
        onUpload(key, proxyUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [folder, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (currentUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl border border-gray-200", aspectClass, className)}>
        <img
          src={currentUrl}
          alt="Imagen actual"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="size-3.5" />
            Cambiar
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onRemove}
            disabled={uploading}
          >
            <X className="size-3.5" />
            Quitar
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors",
          aspectClass,
          dragOver
            ? "border-brand bg-brand/5"
            : "border-gray-200 bg-gray-50 hover:border-brand/50 hover:bg-brand/5",
          uploading && "pointer-events-none opacity-60"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-8 animate-spin text-brand" />
            <p className="text-sm text-muted-foreground">Subiendo... {progress}%</p>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-brand transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-brand/10">
              <ImageIcon className="size-5 text-brand" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Arrastra una imagen o haz clic
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WebP hasta 5MB
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
