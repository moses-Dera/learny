import 'dotenv/config';
import { prisma } from './lib/db';

async function main() {
  try {
    await prisma.course.findMany({
      include: {
        instructor: {
          select: { name: true }
        },
        sections: {
          include: { lessons: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    console.log("SUCCESS");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
main();
