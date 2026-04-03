import { useEffect, useState } from "react";
import { Users, ShieldAlert, Shield, UserX, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRoles {
  user_id: string;
  display_name: string | null;
  phone: string | null;
  created_at: string;
  roles: AppRole[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: allRoles } = await supabase.from("user_roles").select("*");

    if (profiles) {
      const mapped: UserWithRoles[] = profiles.map((p) => ({
        user_id: p.user_id,
        display_name: p.display_name,
        phone: p.phone,
        created_at: p.created_at,
        roles: (allRoles || []).filter((r) => r.user_id === p.user_id).map((r) => r.role),
      }));
      setUsers(mapped);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (userId: string, role: AppRole, hasRole: boolean) => {
    setActionLoading(userId);
    try {
      if (hasRole) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role);
        if (error) throw error;
        toast({ title: "Role removed", description: `Removed "${role}" role.` });
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role });
        if (error) throw error;
        toast({ title: "Role assigned", description: `Assigned "${role}" role.` });
      }
      await fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter((u) =>
    (u.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
    u.user_id.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadgeColor = (role: AppRole) => {
    if (role === "admin") return "bg-primary/20 text-primary border-primary/30";
    if (role === "moderator") return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    return "bg-accent/20 text-accent border-accent/30";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            User Management
          </h2>
          <Badge variant="outline" className="text-muted-foreground">
            <Users className="h-3 w-3 mr-1" /> {users.length} users
          </Badge>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground animate-pulse">Loading users...</div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((u) => {
              const isAdmin = u.roles.includes("admin");
              const isMod = u.roles.includes("moderator");
              return (
                <Card key={u.user_id} className="gradient-card border-border">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {(u.display_name || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{u.display_name || "Unnamed User"}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(u.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {u.roles.length === 0 && (
                              <Badge variant="outline" className="text-xs bg-secondary/50">user</Badge>
                            )}
                            {u.roles.map((r) => (
                              <Badge key={r} variant="outline" className={`text-xs ${roleBadgeColor(r)}`}>
                                {r}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant={isAdmin ? "destructive" : "outline"}
                          onClick={() => toggleRole(u.user_id, "admin", isAdmin)}
                          disabled={actionLoading === u.user_id}
                          className="text-xs"
                        >
                          {isAdmin ? <UserX className="h-3 w-3 mr-1" /> : <ShieldAlert className="h-3 w-3 mr-1" />}
                          {isAdmin ? "Remove Admin" : "Make Admin"}
                        </Button>
                        <Button
                          size="sm"
                          variant={isMod ? "destructive" : "outline"}
                          onClick={() => toggleRole(u.user_id, "moderator", isMod)}
                          disabled={actionLoading === u.user_id}
                          className="text-xs"
                        >
                          {isMod ? <UserX className="h-3 w-3 mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
                          {isMod ? "Remove Mod" : "Make Moderator"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No users found.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
