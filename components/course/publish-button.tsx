"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { publishCourseAction } from "@/lib/actions/courses";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type PublishButtonProps = {
  courseId: string;
  isPublished: boolean;
};

export function PublishButton({ courseId, isPublished }: PublishButtonProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await publishCourseAction(courseId, !isPublished);
      return result;
    },
    null
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      if (isPublished) {
        toast.success("Course unpublished successfully.");
      } else {
        toast.success("Course submitted! It is now pending Admin Review.");
      }
    }
  }, [state, isPublished]);

  return (
    <form action={formAction}>
      <Button 
        variant={isPublished ? "secondary" : "default"}
        type="submit"
        disabled={isPending}
        className="w-[160px]" // Fixed width to prevent layout shift
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          isPublished ? "Unpublish Course" : "Publish Course"
        )}
      </Button>
    </form>
  );
}
