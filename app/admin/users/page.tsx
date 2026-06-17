import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users as UsersIcon, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "User Management | Admin | LearnFlow",
};

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <UsersIcon className="h-8 w-8 text-primary" />
          User Management
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage all registered users, instructors, and administrators.
        </p>
      </div>

      <Card>
        <CardHeader className="bg-card pb-4 border-b border-border/50">
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>A total of {users.length} users are registered on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{user.name || "Unknown"}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      user.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : 
                      user.role === 'INSTRUCTOR' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                      'bg-muted text-muted-foreground border-border'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isBanned ? (
                      <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                        <ShieldAlert className="h-3 w-3" /> Banned
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button disabled className="text-xs font-medium text-muted-foreground opacity-50 cursor-not-allowed">
                      Manage (Coming Soon)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
