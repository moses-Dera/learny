"use client";

import { Save, Wallet, Bell, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { revokeInstructorStatus } from "@/lib/actions/settings";
import { useState } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function SettingsClient({ isStripeConnected }: { isStripeConnected: boolean }) {
  const [isRevoking, setIsRevoking] = useState(false);
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [notifications, setNotifications] = useState({
    enrollment: true,
    review: true,
    approval: true
  });

  const handleConnectStripe = async () => {
    setIsConnectingStripe(true);
    try {
      const res = await fetch("/api/instructor/stripe/connect", { method: "POST" });
      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to connect to Stripe");
        setIsConnectingStripe(false);
      }
    } catch (error) {
      toast.error("An error occurred");
      setIsConnectingStripe(false);
    }
  };

  const handleRevoke = async () => {
    setIsRevoking(true);
    const result = await revokeInstructorStatus();
    
    if (result?.error) {
      toast.error(result.error);
      setIsRevoking(false);
    }
    // If successful, the action will redirect the user.
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Preferences updated", {
      description: "Your notification settings have been saved."
    });
  };

  return (
    <>
      <ConfirmModal 
        isOpen={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        onConfirm={handleRevoke}
        title="Revoke Instructor Status"
        description="Are you absolutely sure? This will unpublish all your courses and return your account to a standard student role. This action cannot be undone."
        confirmText="Yes, revoke my status"
        isDestructive={true}
      />
      <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Studio Settings</h2>
          <p className="text-muted-foreground mt-1">Manage your instructor profile, payouts, and notifications.</p>
        </div>

        <div className="grid gap-6">
          {/* Payout Settings */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Payout Settings</h3>
                <p className="text-sm text-muted-foreground">Connect your bank account to receive course earnings.</p>
              </div>
            </div>
            <div className="p-6 bg-muted/20">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${isStripeConnected ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'}`}>ST</div>
                  <div>
                    <p className="font-medium text-sm">Stripe Connect</p>
                    <p className="text-xs text-muted-foreground">
                      {isStripeConnected ? "Connected and active" : "Not connected"}
                    </p>
                  </div>
                </div>
                {!isStripeConnected && (
                  <Button onClick={handleConnectStripe} disabled={isConnectingStripe} variant="outline" size="sm">
                    {isConnectingStripe ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Connect Account
                  </Button>
                )}
                {isStripeConnected && (
                  <Button variant="outline" size="sm" disabled>
                    Connected
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">Choose what events you want to be notified about.</p>
              </div>
            </div>
            <div className="p-6 bg-muted/20 space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-4 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors" onClick={() => toggleNotification('enrollment')}>
                <span className="text-sm font-medium">New course enrollment</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${notifications.enrollment ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <div className={`w-4 h-4 bg-background rounded-full absolute top-0.5 shadow-sm transition-transform ${notifications.enrollment ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer p-4 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors" onClick={() => toggleNotification('review')}>
                <span className="text-sm font-medium">Course review posted</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${notifications.review ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <div className={`w-4 h-4 bg-background rounded-full absolute top-0.5 shadow-sm transition-transform ${notifications.review ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer p-4 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors" onClick={() => toggleNotification('approval')}>
                <span className="text-sm font-medium">Course approved by Admin</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${notifications.approval ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <div className={`w-4 h-4 bg-background rounded-full absolute top-0.5 shadow-sm transition-transform ${notifications.approval ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card border border-destructive/20 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-destructive/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">Destructive actions for your instructor account.</p>
              </div>
            </div>
            <div className="p-6 bg-destructive/5 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Revoke Instructor Status</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">This will unpublish all your courses and return your account to a standard student role.</p>
              </div>
              <Button onClick={() => setShowRevokeModal(true)} disabled={isRevoking} variant="destructive">
                {isRevoking ? "Revoking..." : "Revoke Status"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
