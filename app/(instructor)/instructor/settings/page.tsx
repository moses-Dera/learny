import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsClient } from "./settings-client";
import { checkStripeConnectStatus } from "@/lib/actions/stripe";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe_setup?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { stripe_setup } = await searchParams;

  if (stripe_setup === "true") {
    // Run the check when returning from Stripe onboarding
    await checkStripeConnectStatus();
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeAccountSetupComplete: true },
  });

  return (
    <SettingsClient isStripeConnected={user?.stripeAccountSetupComplete || false} />
  );
}
