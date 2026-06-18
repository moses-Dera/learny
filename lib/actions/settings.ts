"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function revokeInstructorStatus() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    // 1. Update user role back to STUDENT
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "STUDENT" },
    });

    // 2. Unpublish all their courses to protect the platform
    await prisma.course.updateMany({
      where: { instructorId: session.user.id },
      data: { status: "DRAFT" },
    });

    revalidatePath("/");
    
    // Success, but we can't redirect directly from a try-catch sometimes, 
    // so we return success and redirect on the client, or redirect here.
  } catch (error) {
    console.error("[REVOKE_STATUS]", error);
    return { error: "Failed to revoke status" };
  }

  // Redirect to student dashboard
  redirect("/dashboard");
}

export async function deleteAccount() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { deletedAt: new Date() },
    });

    // Optionally, unpublish courses if they are an instructor
    if (session.user.role === "INSTRUCTOR" || session.user.role === "ADMIN") {
      await prisma.course.updateMany({
        where: { instructorId: session.user.id },
        data: { status: "DRAFT" },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("[DELETE_ACCOUNT]", error);
    return { error: "Failed to delete account" };
  }
}
