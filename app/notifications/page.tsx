import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Bell, Check, CheckCircle2, Circle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { markAsRead, markAllAsRead } from "@/lib/actions/notifications";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Notifications | LearnFlow",
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch all notifications for the user
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Bell className="h-8 w-8 text-primary" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              You have {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}.
            </p>
          </div>

          {unreadCount > 0 && (
            <form action={markAllAsRead}>
              <Button type="submit" variant="outline" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Mark all as read
              </Button>
            </form>
          )}
        </div>

        <Card>
          <CardHeader className="bg-card pb-4 border-b border-border/50">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Updates on your courses, enrollments, and reviews.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>You have no notifications right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-colors hover:bg-muted/50 ${
                      !notification.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0">
                        {!notification.isRead ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                        ) : (
                          <Circle className="h-3 w-3 text-muted-foreground opacity-50" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-medium ${
                              !notification.isRead ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={`text-sm ${!notification.isRead ? "text-foreground/80" : "text-muted-foreground"}`}>
                          {notification.message}
                        </p>
                        
                        {notification.link && (
                          <div className="pt-2">
                            <Link href={notification.link} className="text-sm text-primary hover:underline font-medium">
                              View Details &rarr;
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                    {!notification.isRead && (
                      <div className="ml-6 sm:ml-0 flex-shrink-0">
                        <form
                          action={async () => {
                            "use server";
                            await markAsRead(notification.id);
                          }}
                        >
                          <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground">
                            <Check className="h-4 w-4 mr-2" />
                            Mark read
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
