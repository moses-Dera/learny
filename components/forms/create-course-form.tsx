"use client";

import * as React from "react";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
import { createCourseAction } from "@/lib/actions/courses";
import { useRouter } from "next/navigation";

export function CreateCourseForm({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createCourseAction, null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

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
        <Label htmlFor="thumbnailUrl">Thumbnail Image</Label>
        <ImageUploader 
          value={thumbnailUrl} 
          onChange={setThumbnailUrl} 
          disabled={isLoading} 
        />
        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
        <p className="text-xs text-muted-foreground">Upload a cover image for your course (16:9 recommended).</p>
        {state?.details?.thumbnailUrl && <p className="text-xs text-destructive">{state.details.thumbnailUrl[0]}</p>}
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

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            disabled={isLoading}
            required
            defaultValue=""
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id} className="bg-background text-foreground">
                {category.name}
              </option>
            ))}
          </select>
          {state?.details?.categoryId && <p className="text-xs text-destructive">{state.details.categoryId[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Difficulty Level</Label>
          <select
            id="level"
            name="level"
            disabled={isLoading}
            required
            defaultValue=""
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>Select a level</option>
            <option value="BEGINNER" className="bg-background text-foreground">Beginner</option>
            <option value="INTERMEDIATE" className="bg-background text-foreground">Intermediate</option>
            <option value="ADVANCED" className="bg-background text-foreground">Advanced</option>
          </select>
          {state?.details?.level && <p className="text-xs text-destructive">{state.details.level[0]}</p>}
        </div>
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
