import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Save, Globe, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Platform Settings | Admin | LearnFlow",
};

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Platform Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure global platform variables, fees, and security policies.
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader className="bg-card pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <CardTitle>General Configuration</CardTitle>
            </div>
            <CardDescription>Basic settings for the LearnFlow platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform Name</label>
              <input 
                type="text" 
                defaultValue="LearnFlow LMS" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Support Email</label>
              <input 
                type="email" 
                defaultValue="support@learnflow.com" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card>
          <CardHeader className="bg-card pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Financial & Billing</CardTitle>
            </div>
            <CardDescription>Configure instructor payouts and platform fees.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform Fee Percentage (%)</label>
              <input 
                type="number" 
                defaultValue="15" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">The percentage cut the platform takes from every course sale.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stripe Connect Payout Schedule</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>Daily</option>
                <option>Weekly (Standard)</option>
                <option>Monthly</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader className="bg-card pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage registration and authentication constraints.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Allow New Instructor Registrations</p>
                <p className="text-xs text-muted-foreground">If disabled, new instructors must be manually invited.</p>
              </div>
              <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div>
                <p className="text-sm font-medium">Require Email Verification</p>
                <p className="text-xs text-muted-foreground">Users must verify their email before accessing courses.</p>
              </div>
              <div className="w-11 h-6 bg-muted rounded-full relative cursor-pointer border border-border">
                <div className="absolute left-1 top-1 w-4 h-4 bg-muted-foreground/50 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
