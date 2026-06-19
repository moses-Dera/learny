// NextAuth v5 configuration.
// auth(), handlers, signIn, signOut are all exported from here.
// Node-compatible runtime — Prisma and bcryptjs are safe here.

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { z } from "zod";
import { authConfig } from "@/lib/auth.config";
import { cookies } from "next/headers";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email, deletedAt: null },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            password: true,
            role: true,
            isBanned: true,
          },
        });

        if (!user?.password) return null;
        if (user.isBanned) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,
    
    // Ghost duplicate prevention — block sign-in if email already exists
    // under a different provider to avoid creating ghost duplicate accounts.
    async signIn({ user, account }) {
      if (!account || account.type !== "oauth") return true;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { accounts: true },
      });

      if (!existingUser) return true;

      // User already has an account with this provider
      const linkedToThisProvider = existingUser.accounts.some(
        (a) => a.provider === account.provider,
      );
      if (linkedToThisProvider) return true;

      // User exists under a different provider — block and surface error
      if (existingUser.accounts.length > 0) {
        const providers = existingUser.accounts.map((a) => a.provider);
        return `/login?error=OAuthAccountNotLinked&providers=${providers.join(",")}`;
      }

      return true;
    },
  },

  events: {
    async createUser({ user }) {
      try {
        const cookieStore = await cookies();
        const intendedRole = cookieStore.get("intendedRole")?.value;
        
        if (intendedRole === "INSTRUCTOR") {
          if (user.id) {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: "INSTRUCTOR" },
            });
            console.log(`[AUTH_EVENT] Upgraded newly created user ${user.email} to INSTRUCTOR`);
          }
        }
      } catch (error) {
        console.error("[AUTH_EVENT_ERROR] Failed to assign role during user creation:", error);
      }
    },
  },
});
