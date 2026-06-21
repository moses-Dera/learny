"use client";

import MuxPlayer from "@mux/mux-player-react";
import { Lock, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  lessonId: string;
  isLocked: boolean;
}

export function VideoPlayer({ playbackId, courseId, lessonId, isLocked }: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const lastSavedTime = useRef(0);

  if (isLocked) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted flex flex-col items-center justify-center gap-y-3 text-muted-foreground shadow-sm border border-border">
        <div className="p-4 bg-background/50 rounded-full">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm font-medium">This lesson is locked. Please enroll to watch.</p>
      </div>
    );
  }

  if (!playbackId) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted flex flex-col items-center justify-center gap-y-3 text-muted-foreground shadow-sm border border-border">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm font-medium">Video is processing...</p>
      </div>
    );
  }

  const handleEnded = async () => {
    try {
      const { completeLesson } = await import("@/lib/actions/progress");
      await completeLesson(lessonId);
      router.refresh();
    } catch (error) {
      console.error("Failed to mark lesson complete", error);
    }
  };

  const handleTimeUpdate = async (e: Event) => {
    const target = e.target as HTMLVideoElement;
    const currentTime = target.currentTime;
    
    // Auto-save every 30 seconds
    if (currentTime - lastSavedTime.current >= 30) {
      lastSavedTime.current = currentTime;
      try {
        const { updateWatchProgress } = await import("@/lib/actions/progress");
        await updateWatchProgress(lessonId, currentTime);
      } catch (error) {
        // Silently fail in background
      }
    }
  };

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-border bg-black">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <MuxPlayer
        title="Lesson Video"
        playbackId={playbackId}
        className="w-full h-full"
        onCanPlay={() => setIsReady(true)}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        accentColor="var(--primary)"
      />
    </div>
  );
}
