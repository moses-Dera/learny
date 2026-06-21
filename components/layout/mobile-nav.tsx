"use client";

import { Menu, LogOut, ShieldCheck, BookOpen, Users, Tags, Settings, LayoutDashboard, Video, BarChart } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";

interface MobileNavProps {
  isInstructor?: boolean;
  isAdmin?: boolean;
  isAuthenticated?: boolean;
  context?: "admin" | "instructor" | "student" | "public";
}

export function MobileNav({ isInstructor, isAdmin, isAuthenticated = true, context = "public" }: MobileNavProps) {
  const router = useRouter();

  return (
    <div className="md:hidden flex items-center mr-4">
      <DropdownMenu>
        <DropdownMenuTrigger className={`${buttonVariants({ variant: "ghost", size: "icon" })} h-10 w-10 px-0`}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 mt-2 max-h-[80vh] overflow-y-auto">
          {/* Context-Specific Links */}
          {context === "admin" && (
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Admin Console</DropdownMenuLabel>
              <DropdownMenuItem className="w-full cursor-pointer py-2 text-base gap-3" onClick={() => router.push("/admin")}>
                <ShieldCheck className="h-4 w-4" /> Overview
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full cursor-pointer py-2 text-base gap-3" onClick={() => router.push("/admin/courses")}>
                <BookOpen className="h-4 w-4" /> Course Reviews
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full cursor-pointer py-2 text-base gap-3" onClick={() => router.push("/admin/users")}>
                <Users className="h-4 w-4" /> Users
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full cursor-pointer py-2 text-base gap-3" onClick={() => router.push("/admin/categories")}>
                <Tags className="h-4 w-4" /> Categories
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full cursor-pointer py-2 text-base gap-3" onClick={() => router.push("/admin/settings")}>
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          )}

          {context === "instructor" && (
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Instructor Studio</DropdownMenuLabel>
              <DropdownMenuItem className="w-full cursor-pointer py-2 text-base gap-3" onClick={() => router.push("/instructor")}>
                <LayoutDashboard className="h-4 w-4" /> Overview
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full cursor-pointer py-2 text-base gap-3" onClick={() => router.push("/instructor/courses")}>
                <Video className="h-4 w-4" /> Course Management
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full cursor-pointer py-2 text-base gap-3" onClick={() => router.push("/instructor/analytics")}>
                <BarChart className="h-4 w-4" /> Revenue & Analytics
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full cursor-pointer py-2 text-base gap-3" onClick={() => router.push("/instructor/settings")}>
                <Settings className="h-4 w-4" /> Studio Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          )}

          {/* Global Navigation Links */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Platform</DropdownMenuLabel>
            {!isAuthenticated ? (
              <>
                <DropdownMenuItem className="w-full cursor-pointer py-2 text-base" onClick={() => router.push("/courses")}>
                  Course Catalog
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="w-full cursor-pointer py-2 text-base" onClick={() => router.push("/login")}>
                  Sign In
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full cursor-pointer py-2 text-base text-primary font-medium" onClick={() => router.push("/register")}>
                  Get Started Free
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem className="w-full cursor-pointer py-2 text-base" onClick={() => router.push("/dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full cursor-pointer py-2 text-base" onClick={() => router.push("/courses")}>
                  Course Catalog
                </DropdownMenuItem>
                
                {isInstructor && context !== "instructor" && (
                  <DropdownMenuItem className="w-full cursor-pointer py-2 text-base text-primary font-medium" onClick={() => router.push("/instructor")}>
                    Instructor Studio
                  </DropdownMenuItem>
                )}
                
                {isAdmin && context !== "admin" && (
                  <DropdownMenuItem className="w-full cursor-pointer py-2 text-base" onClick={() => router.push("/admin")}>
                    Admin Console
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="w-full cursor-pointer py-2 text-base" onClick={() => router.push("/dashboard/settings")}>
                  Profile Settings
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer py-2 text-base" onClick={() => signOut({ callbackUrl: "/login" })}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
