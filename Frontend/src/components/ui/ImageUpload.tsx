import { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Camera, X, User, Loader2, ZoomIn, Crop, Check } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

/** Generate a cropped image blob from canvas */
function getCroppedImg(imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Failed to get canvas context"));
      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y,
        pixelCrop.width, pixelCrop.height,
        0, 0,
        pixelCrop.width, pixelCrop.height
      );
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob"));
      }, "image/jpeg", 0.9);
    };
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = imageSrc;
  });
}

interface ImageUploadProps {
  currentImage?: string;
  onUploadSuccess: (url: string) => void;
}

const ImageUpload = ({ currentImage, onUploadSuccess }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  // Crop state
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // Render file input in a portal root so Radix Dialog doesn't block the click
  const [portalRoot] = useState(() => {
    if (typeof document !== "undefined") {
      const el = document.createElement("div");
      el.id = "image-upload-portal";
      document.body.appendChild(el);
      return el;
    }
    return null;
  });

  useEffect(() => {
    return () => {
      portalRoot?.remove();
    };
  }, [portalRoot]);

  const triggerFileInput = () => {
    fileRef.current?.click();
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5 MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCropSrc(reader.result as string);
      setCropOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedPixels: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!cropSrc || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(cropSrc, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setCroppedPreview(croppedUrl);
      setCropOpen(false);
      // Keep cropSrc and croppedAreaPixels for upload
    } catch {
      toast.error("Failed to crop image. Please try again.");
    }
  };

  const handleUpload = async () => {
    if (!croppedAreaPixels || !cropSrc) {
      toast.error("Please crop your image first.");
      return;
    }

    setUploading(true);
    try {
      const croppedBlob = await getCroppedImg(cropSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("profile_picture", croppedBlob, "profile.jpg");
      const result = await api.patch<{ profile_picture: string }>("/users/me/", formData);
      onUploadSuccess(result.profile_picture);
      setCroppedPreview(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Profile picture updated!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setCroppedPreview(null);
    setPreview(null);
    setCropOpen(false);
    setCropSrc(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCancelCrop = () => {
    setCropOpen(false);
    setCropSrc(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const displayImage = croppedPreview || preview || currentImage;

  return (
    <>
      {/* File input rendered outside Dialog via portal */}
      {portalRoot &&
        ReactDOM.createPortal(
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleSelect}
            className="hidden"
          />,
          portalRoot
        )}

      {/* Full-size image lightbox */}
      {showFullImage && displayImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-lg w-full mx-4">
            <img
              src={displayImage}
              alt="Profile full size"
              className="w-full rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Crop modal */}
      {cropOpen && cropSrc && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80">
          <div className="relative w-full max-w-md mx-4 flex flex-col">
            <p className="text-white text-sm font-medium mb-3 text-center">Crop your profile picture</p>
            <div className="relative h-[300px] sm:h-[350px] w-full rounded-lg overflow-hidden bg-gray-900">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            {/* Zoom slider */}
            <div className="mt-4 flex items-center gap-3 px-2">
              <span className="text-white text-xs">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-[#1D9E75]"
              />
              <span className="text-white text-xs w-8 text-right">{zoom.toFixed(1)}x</span>
            </div>
            {/* Action buttons */}
            <div className="flex gap-3 mt-4 mb-2">
              <Button
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={handleCancelCrop}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#1D9E75] text-white hover:bg-[#0F6E56] gap-2"
                onClick={handleApplyCrop}
              >
                <Check className="h-4 w-4" />
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        {/* Avatar circle with hover overlay */}
        <div className="relative group cursor-pointer">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full overflow-hidden border-2 border-white shadow-md"
            style={{ backgroundColor: "#0F6E56" }}
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-white" />
            )}
          </div>
          {/* Hover overlay: camera (to change) or zoom (to view) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (displayImage && !croppedPreview) {
                setShowFullImage(true);
              } else {
                triggerFileInput();
              }
            }}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            {displayImage && !croppedPreview ? (
              <ZoomIn className="h-5 w-5 text-white" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </button>
          {/* Uploading spinner overlay */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Save / Cancel buttons */}
        {croppedPreview && (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-[#1D9E75] text-white hover:bg-[#0F6E56] gap-1"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={uploading}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        )}

        {/* "Change photo" link */}
        {!croppedPreview && (
          <button
            type="button"
            onClick={triggerFileInput}
            className="text-xs text-[#1D9E75] hover:underline cursor-pointer"
          >
            Change photo
          </button>
        )}
      </div>
    </>
  );
};

export default ImageUpload;
