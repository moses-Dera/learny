import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { VideoPlayer } from "@/components/course/video-player";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { completeLesson } from "@/lib/actions/progress";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const session = await auth();
  
  if (!session?.user?.id) redirect("/login");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      section: true,
      progress: {
        where: { userId: session.user.id }
      }
    }
  });

  if (!lesson || lesson.section.courseId !== courseId) {
    notFound();
  }

  const isCompleted = lesson.progress[0]?.isCompleted || false;

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full p-4 lg:p-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-foreground">{lesson.title}</h1>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{lesson.section.title}</p>
      </div>

      <div className="w-full">
        {lesson.videoStatus === "READY" && lesson.muxPlaybackId ? (
           <VideoPlayer 
             playbackId={lesson.muxPlaybackId}
             courseId={courseId}
             lessonId={lessonId}
             isLocked={false}
           />
        ) : (
          <div className="aspect-video w-full bg-card border border-border rounded-xl flex items-center justify-center flex-col gap-2 shadow-sm">
            <p className="font-medium text-foreground">Video is not available</p>
            <p className="text-sm text-muted-foreground">Status: {lesson.videoStatus}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-card border border-border rounded-xl shadow-sm gap-4">
        <div>
          <h3 className="font-bold text-foreground mb-1">Lesson Progress</h3>
          <p className="text-sm text-muted-foreground">
            {isCompleted ? "You've successfully completed this lesson." : "Finish watching the video to proceed."}
          </p>
        </div>
        
        <form action={async () => {
          "use server";
          await completeLesson(lessonId);
        }}>
          <Button 
            variant={isCompleted ? "outline" : "default"} 
            className={`gap-2 w-full sm:w-auto ${isCompleted ? 'border-green-500/30 bg-green-500/5 text-green-600 hover:bg-green-500/10' : ''}`}
            disabled={isCompleted}
          >
            <CheckCircle className={`w-4 h-4 ${isCompleted ? "text-green-500" : ""}`} />
            {isCompleted ? "Completed" : "Mark as Complete"}
          </Button>
        </form>
      </div>
    </div>
  );
}
