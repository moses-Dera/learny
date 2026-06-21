import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { CourseReviewActions } from "@/components/admin/course-review-actions";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Course Reviews | Admin",
};

export default async function AdminCoursesReviewPage() {
  const courses = await prisma.course.findMany({
    where: { status: "REVIEW" },
    include: {
      instructor: {
        select: { name: true, email: true }
      },
      _count: {
        select: { sections: true }
      }
    },
    orderBy: { updatedAt: "asc" }
  });

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Course Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve courses submitted by instructors.
        </p>
      </div>

      {courses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <CheckIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">All caught up!</h2>
          <p className="mt-2 text-muted-foreground max-w-sm">
            There are currently no courses pending review. You're doing great!
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {courses.map((course: any) => (
            <Card key={course.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">
                    <Link href={`/courses/${course.id}`} className="hover:underline">
                      {course.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <span>By {course.instructor.name || course.instructor.email}</span>
                    <span>•</span>
                    <span>Submitted {formatDistanceToNow(new Date(course.updatedAt), { addSuffix: true })}</span>
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                  Pending Review
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{course._count.sections}</span> Sections
                  {" • "}
                  Price: <span className="font-medium text-foreground">${Number(course.price).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/courses/${course.id}`}
                    target="_blank"
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    View Preview
                  </Link>
                  <div className="ml-auto">
                    <CourseReviewActions courseId={course.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
