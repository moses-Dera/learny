"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { deleteAccount } from "@/lib/actions/settings";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export function DeleteAccountButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const result = await deleteAccount();
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Account deleted successfully.");
      // Sign out and redirect to home
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => setIsModalOpen(true)}
      >
        Delete Account
      </Button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        description="Are you sure you want to permanently delete your account? This action cannot be undone, and you will lose access to all your purchased courses."
        confirmText="Delete Account"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}
