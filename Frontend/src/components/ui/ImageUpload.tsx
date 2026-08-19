import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface ImageUploadProps {
  currentImage?: string;
  onUploadSuccess: (url: string) => void;
}

const ImageUpload = ({ currentImage, onUploadSuccess }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5 MB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("profile_picture", file);
      const result = await api.patch<{ profile_picture: string }>("/users/me/", formData);
      onUploadSuccess(result.profile_picture);
      setPreview(null);
      toast({ title: "Profile picture updated" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const displayImage = preview || currentImage;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full overflow-hidden"
          style={{ backgroundColor: "#0F6E56" }}
        >
          {displayImage ? (
            <img src={displayImage} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-white" />
          )}
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Camera className="h-6 w-6 text-white" />
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />

      {preview && (
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
            onClick={() => setPreview(null)}
            disabled={uploading}
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
      )}

      {!preview && (
        <button
          onClick={() => fileRef.current?.click()}
          className="text-xs text-[#1D9E75] hover:underline cursor-pointer"
        >
          Change photo
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
