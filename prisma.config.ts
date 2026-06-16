// Prisma 7 configuration file.
// Connection URL for Prisma CLI (migrate, db push, studio).
// The runtime PrismaClient adapter is configured separately in lib/db.ts.
// See: https://pris.ly/d/config-datasource

import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
