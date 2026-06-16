"use client";

import * as React from "react";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCourseAction } from "@/lib/actions/courses";
import { useRouter } from "next/navigation";

export function CreateCourseForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createCourseAction, null);

  useEffect(() => {
    if (state?.success && state.courseId) {
      // Redirect to the course management dashboard once created
      router.push(`/instructor/courses/${state.courseId}`);
    }
  }, [state, router]);

  const isLoading = isPending || state?.success;

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Advanced Next.js Architecture"
          disabled={isLoading}
          required
          className="bg-transparent"
        />
        {state?.details?.title && <p className="text-xs text-destructive">{state.details.title[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Course Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What will students learn in this course?"
          rows={4}
          disabled={isLoading}
          required
          className="bg-transparent resize-none"
        />
        {state?.details?.description && <p className="text-xs text-destructive">{state.details.description[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (USD)</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-muted-foreground sm:text-sm">$</span>
          </div>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            disabled={isLoading}
            required
            className="pl-7 bg-transparent"
          />
        </div>
        {state?.details?.price && <p className="text-xs text-destructive">{state.details.price[0]}</p>}
      </div>

      {state?.error && (
        <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
          {state.error}
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          disabled={isLoading}
          onClick={() => router.back()}
          className="mr-3"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Course"}
        </Button>
      </div>
    </form>
  );
}
