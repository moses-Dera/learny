import type { NextAuthConfig } from "next-auth";

// Edge-compatible NextAuth config.
// No Prisma, no bcryptjs, no Node APIs here.

export const authConfig = {
  session: { strategy: "jwt" },
  providers: [], // Providers that require DB/Node are injected in lib/auth.ts
  callbacks: {
    // Embed role and id in JWT — middleware reads these without a DB call
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;
