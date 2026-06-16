import { prisma } from "../lib/db";

async function check() {
  const latestLesson = await prisma.lesson.findFirst({
    orderBy: { id: 'desc' }
  });
  console.log(latestLesson);
}

check();
