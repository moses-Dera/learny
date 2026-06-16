"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export async function markAsRead(id: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.notification.update({
    where: {
      id,
      userId: session.user.id, // security check
    },
    data: { isRead: true },
  });

  revalidatePath("/", "layout");
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  revalidatePath("/", "layout");
}
