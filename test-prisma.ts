import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
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
  })
}
main().catch(e => console.error(e))
