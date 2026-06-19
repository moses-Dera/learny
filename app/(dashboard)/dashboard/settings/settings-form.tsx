"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateProfile, toggleNotification } from "@/lib/actions/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bell } from "lucide-react";

export function SettingsForm({ 
  user 
}: { 
  user: { id: string; name: string | null; email: string; notifyCourseUpdates: boolean; notifyMarketing: boolean } 
}) {
  const [isPending, startTransition] = useTransition();

  const handleProfileSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const res = await updateProfile(formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Profile updated successfully!");
      }
    });
  };

  const handleToggle = (type: "marketing" | "courses", currentVal: boolean) => {
    startTransition(async () => {
      const res = await toggleNotification(type, !currentVal);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Preferences updated!");
      }
    });
  };

  return (
    <div className="grid gap-6 animate-in fade-in duration-500">
      {/* Profile Settings */}
      <Card>
        <CardHeader className="bg-card pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>Update your name and profile visibility.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form action={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input 
                name="name"
                type="text" 
                defaultValue={user.name || ""} 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input 
                type="email" 
                defaultValue={user.email} 
                disabled
                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">Email addresses cannot be changed once registered.</p>
            </div>
            <div className="pt-2">
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader className="bg-card pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>Choose what we email you about.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
            <div>
              <p className="text-sm font-medium">Course Updates</p>
              <p className="text-xs text-muted-foreground">Get notified when a course you are enrolled in is updated.</p>
            </div>
            <div 
              onClick={() => handleToggle("courses", user.notifyCourseUpdates)}
              className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${user.notifyCourseUpdates ? 'bg-primary' : 'bg-muted border border-border'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${user.notifyCourseUpdates ? 'right-1' : 'left-1 bg-muted-foreground/50'}`}></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
            <div>
              <p className="text-sm font-medium">Marketing Emails</p>
              <p className="text-xs text-muted-foreground">Receive promotional offers and recommendations.</p>
            </div>
            <div 
              onClick={() => handleToggle("marketing", user.notifyMarketing)}
              className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${user.notifyMarketing ? 'bg-primary' : 'bg-muted border border-border'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${user.notifyMarketing ? 'right-1' : 'left-1 bg-muted-foreground/50'}`}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
