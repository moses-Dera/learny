"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";

export async function checkStripeConnectStatus() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.stripeAccountId) {
    return { error: "No Stripe account found" };
  }

  try {
    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    
    // If charges are enabled, setup is complete
    if (account.charges_enabled && !user.stripeAccountSetupComplete) {
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeAccountSetupComplete: true },
      });
      revalidatePath("/instructor/settings");
      return { success: true, complete: true };
    }

    return { success: true, complete: account.charges_enabled };
  } catch (error: any) {
    console.error("[CHECK_STRIPE_STATUS]", error);
    return { error: error.message };
  }
}
