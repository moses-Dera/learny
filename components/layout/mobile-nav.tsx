"use client";

import { Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  isInstructor?: boolean;
  isAdmin?: boolean;
}

export function MobileNav({ isInstructor, isAdmin }: MobileNavProps) {
  return (
    <div className="md:hidden flex items-center mr-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 px-0">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 mt-2">
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="w-full cursor-pointer py-2 text-base">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/courses" className="w-full cursor-pointer py-2 text-base">Course Catalog</Link>
          </DropdownMenuItem>
          
          {isInstructor && (
            <DropdownMenuItem asChild>
              <Link href="/instructor" className="w-full cursor-pointer py-2 text-base text-primary font-medium">Instructor Studio</Link>
            </DropdownMenuItem>
          )}
          
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="w-full cursor-pointer py-2 text-base">Admin Console</Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="w-full cursor-pointer py-2 text-base">Settings</Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive cursor-pointer py-2 text-base"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
