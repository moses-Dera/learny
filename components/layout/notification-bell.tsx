"use client";

import Link from "next/link";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { markAsRead, markAllAsRead } from "@/lib/actions/notifications";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

type NotificationType = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
};

export function NotificationBell({ initialNotifications }: { initialNotifications: NotificationType[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string, link: string | null) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markAsRead(id);
    
    if (link) {
      router.push(link);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllAsRead();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`${buttonVariants({ variant: "ghost", size: "icon" })} relative`}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto py-1 px-2 text-muted-foreground hover:text-foreground"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            <div className="flex flex-col gap-1 p-1">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                    !notification.isRead ? "bg-muted/50 font-medium" : ""
                  }`}
                  onClick={() => handleMarkAsRead(notification.id, notification.link)}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm">{notification.title}</span>
                    {!notification.isRead && (
                      <span className="flex h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="outline" className="w-full text-xs h-8" asChild>
            <Link href="/notifications">View all notifications</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
