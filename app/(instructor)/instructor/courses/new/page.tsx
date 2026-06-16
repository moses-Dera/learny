import { Metadata } from "next";
import { CreateCourseForm } from "@/components/forms/create-course-form";

export const metadata: Metadata = {
  title: "Create New Course | Instructor Studio",
  description: "Create a new course in the Learny instructor studio",
};

export default function CreateCoursePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300 py-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Create New Course</h2>
        <p className="text-muted-foreground mt-1">
          Give your course a title, a compelling description, and set your price. You can upload videos and build out the curriculum next.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <CreateCourseForm />
      </div>
    </div>
  );
}
