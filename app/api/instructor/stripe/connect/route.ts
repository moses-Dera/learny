import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let stripeAccountId = user.stripeAccountId;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "standard",
        email: user.email,
        business_profile: {
          url: env.NEXT_PUBLIC_APP_URL,
        },
      });

      stripeAccountId = account.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeAccountId },
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${env.NEXT_PUBLIC_APP_URL}/instructor/settings`,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/instructor/settings?stripe_setup=true`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    console.error("[STRIPE_CONNECT_ERROR]", error);
    return NextResponse.json({ error: "Failed to connect to Stripe payment provider. Please verify your Stripe configuration." }, { status: 500 });
  }
}
