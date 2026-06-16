import { Save, Wallet, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
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
                <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">ST</div>
                <div>
                  <p className="font-medium text-sm">Stripe Connect</p>
                  <p className="text-xs text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect Account</Button>
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
            {["New course enrollment", "Course review posted", "Course approved by Admin"].map((item, i) => (
              <label key={i} className="flex items-center justify-between cursor-pointer p-4 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors">
                <span className="text-sm font-medium">{item}</span>
                <div className="w-10 h-5 bg-primary/20 rounded-full relative">
                  <div className="w-4 h-4 bg-primary rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                </div>
              </label>
            ))}
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
            <Button variant="destructive">Revoke Status</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
