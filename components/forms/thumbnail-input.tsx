"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ui/image-uploader";

export function ThumbnailInput({ initialValue }: { initialValue?: string }) {
  const [thumbnailUrl, setThumbnailUrl] = useState(initialValue || "");

  return (
    <>
      <ImageUploader 
        value={thumbnailUrl} 
        onChange={setThumbnailUrl} 
      />
      <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
    </>
  );
}
