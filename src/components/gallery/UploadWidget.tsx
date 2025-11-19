"use client";

import { Button } from "@/components/ui/button";
import { useMemories } from "@/hooks/useMemories";
import { Loader2, Upload } from "lucide-react";
import { useRef } from "react";

export default function UploadWidget() {
  const { uploadMutation } = useMemories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadMutation.mutate(e.target.files[0]);
    }
  };

  return (
    <div>
      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Pretty Button */}
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadMutation.isPending}
        className={`
          relative overflow-hidden
          bg-gradient-to-r from-pink-500 to-pink-600 
          hover:from-pink-600 hover:to-pink-700 
          text-white font-medium gap-2 rounded-full px-5 py-2.5
          shadow-lg hover:shadow-pink-300/50
          transition-all duration-300
        `}
      >
        {uploadMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="animate-pulse">Uploading…</span>
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Add Memory
          </>
        )}

        {/* Soft glow effect */}
        <span className="absolute inset-0 rounded-full bg-pink-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
      </Button>
    </div>
  );
}
