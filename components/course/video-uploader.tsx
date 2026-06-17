"use client";

import MuxUploader, { MuxUploaderStatus } from "@mux/mux-uploader-react";
import { useState } from "react";
import { updateLessonUploadId } from "@/lib/actions/lessons"; // We will create this next


interface VideoUploaderProps {
  lessonId: string;
  onUploadSuccess?: () => void;
}

export function VideoUploader({ lessonId, onUploadSuccess }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUploadUrl = async () => {
    try {
      setIsUploading(true);
      setError(null);
      
      const response = await fetch("/api/upload/mux", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const data = await response.json();
      
      // Save the Mux Upload ID to the lesson immediately so the webhook knows which lesson to update later
      const result = await updateLessonUploadId(lessonId, data.uploadId);
      if (result.error) {
        throw new Error(result.error);
      }

      return data.url;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to initialize upload");
      setIsUploading(false);
      throw err;
    }
  };

  const handleUploadSuccess = () => {
    setIsUploading(false);
    if (onUploadSuccess) onUploadSuccess();
  };

  return (
    <div className="w-full bg-background border border-border rounded-xl p-4 overflow-hidden relative">
      {error && (
        <div className="absolute top-0 left-0 w-full p-2 bg-destructive/90 text-destructive-foreground text-xs text-center z-10 font-medium">
          {error}
        </div>
      )}
      
      <div className="mx-auto max-w-sm">
        <MuxUploader 
          endpoint={getUploadUrl}
          onSuccess={handleUploadSuccess}
          className="w-full rounded-md mux-uploader-theme"
        />
        <MuxUploaderStatus 
          className="mt-2 text-sm font-medium text-center mux-uploader-theme"
        />
      </div>
      
      {/* We add some custom CSS vars for the Mux Uploader to match our theme */}
      <style dangerouslySetInnerHTML={{__html: `
        .mux-uploader-theme {
          --uploader-font-family: inherit;
          --uploader-background-color: var(--muted);
          --uploader-button-background-color: var(--primary);
          --uploader-button-text-color: var(--primary-foreground);
          --uploader-button-border-radius: var(--radius);
        }
      `}} />
    </div>
  );
}
