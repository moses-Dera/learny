import "dotenv/config";
import { prisma } from "../lib/db";

const CATEGORIES = [
  { name: "Web Development", slug: "web-development" },
  { name: "Mobile Development", slug: "mobile-development" },
  { name: "Data Science", slug: "data-science" },
  { name: "Artificial Intelligence", slug: "artificial-intelligence" },
  { name: "Cloud Computing", slug: "cloud-computing" },
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "Design & UX", slug: "design-ux" },
  { name: "Business & Management", slug: "business-management" },
  { name: "Marketing", slug: "marketing" },
  { name: "Finance & Accounting", slug: "finance-accounting" },
  { name: "Personal Development", slug: "personal-development" },
  { name: "Photography & Video", slug: "photography-video" },
  { name: "Music & Audio", slug: "music-audio" },
  { name: "Health & Fitness", slug: "health-fitness" },
  { name: "Language Learning", slug: "language-learning" },
];

async function seedCategories() {
  console.log("Seeding categories...");
  
  let count = 0;
  for (const category of CATEGORIES) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug }
    });

    if (!existing) {
      await prisma.category.create({
        data: category
      });
      count++;
      console.log(`Created: ${category.name}`);
    } else {
      console.log(`Skipped (already exists): ${category.name}`);
    }
  }

  console.log(`\nSuccess! Seeded ${count} new categories.`);
}

seedCategories()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
