import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Settings as SettingsIcon, AlertTriangle } from "lucide-react";
import { DeleteAccountButton } from "./delete-account-button";
import { SettingsForm } from "./settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Account Settings | LearnFlow",
};

export default async function DashboardSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      notifyCourseUpdates: true,
      notifyMarketing: true,
    }
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Account Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information, email preferences, and security.
        </p>
      </div>

      <div className="grid gap-6">
        <SettingsForm user={user} />

        {/* Danger Zone */}
        <Card className="border-red-500/20">
          <CardHeader className="bg-red-500/5 pb-4 border-b border-red-500/10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
            </div>
            <CardDescription className="text-red-500/80">Permanent and destructive actions.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-xs text-muted-foreground max-w-[400px]">
                  Permanently delete your account and all associated data. This action cannot be undone and you will lose access to all your purchased courses.
                </p>
              </div>
              <DeleteAccountButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
