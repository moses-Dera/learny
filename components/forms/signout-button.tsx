"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="w-4 h-4 mr-3" />
      Sign Out
    </Button>
  );
}
