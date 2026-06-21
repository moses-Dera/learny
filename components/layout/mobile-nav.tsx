"use client";

import { Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";

interface MobileNavProps {
  isInstructor?: boolean;
  isAdmin?: boolean;
  isAuthenticated?: boolean;
}

export function MobileNav({ isInstructor, isAdmin, isAuthenticated = true }: MobileNavProps) {
  const router = useRouter();

  return (
    <div className="md:hidden flex items-center mr-4">
      <DropdownMenu>
        <DropdownMenuTrigger className={`${buttonVariants({ variant: "ghost", size: "icon" })} h-10 w-10 px-0`}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 mt-2">
          {!isAuthenticated ? (
            <>
              <DropdownMenuItem 
                className="w-full cursor-pointer py-2 text-base"
                onClick={() => router.push("/courses")}
              >
                Course Catalog
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="w-full cursor-pointer py-2 text-base"
                onClick={() => router.push("/login")}
              >
                Sign In
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="w-full cursor-pointer py-2 text-base text-primary font-medium"
                onClick={() => router.push("/register")}
              >
                Get Started Free
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem 
                className="w-full cursor-pointer py-2 text-base"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="w-full cursor-pointer py-2 text-base"
                onClick={() => router.push("/courses")}
              >
                Course Catalog
              </DropdownMenuItem>
              
              {isInstructor && (
                <DropdownMenuItem 
                  className="w-full cursor-pointer py-2 text-base text-primary font-medium"
                  onClick={() => router.push("/instructor")}
                >
                  Instructor Studio
                </DropdownMenuItem>
              )}
              
              {isAdmin && (
                <DropdownMenuItem 
                  className="w-full cursor-pointer py-2 text-base"
                  onClick={() => router.push("/admin")}
                >
                  Admin Console
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="w-full cursor-pointer py-2 text-base"
                onClick={() => router.push("/dashboard/settings")}
              >
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer py-2 text-base"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
