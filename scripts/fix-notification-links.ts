import "dotenv/config";
import { prisma } from "../lib/db";

async function fixLinks() {
  const notifications = await prisma.notification.findMany();
  let count = 0;
  for (const n of notifications) {
    if (n.link?.startsWith("/dashboard")) {
      await prisma.notification.update({
        where: { id: n.id },
        data: { link: n.link.replace("/dashboard", "") }
      });
      count++;
    }
  }
  console.log(`Fixed ${count} broken notification links!`);
}
fixLinks().catch(console.error).finally(() => prisma.$disconnect());
