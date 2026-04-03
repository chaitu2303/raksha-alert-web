import { LayoutDashboard, AlertTriangle, FileText, MapPin, Settings, LogOut, Menu, X, ShieldAlert, MessageSquare, Users, BarChart3, Cog } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NotificationBell from "@/components/NotificationBell";

const userLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Alerts", href: "/dashboard/alerts", icon: AlertTriangle },
  { label: "Report Incident", href: "/dashboard/report", icon: FileText },
  { label: "Map", href: "/dashboard/map", icon: MapPin },
  { label: "Support Chat", href: "/dashboard/support", icon: MessageSquare },
  { label: "Profile", href: "/dashboard/profile", icon: Settings },
];

const adminLinks = [
  { label: "Admin Panel", href: "/admin", icon: ShieldAlert },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Post Alert", href: "/admin/post-alert", icon: AlertTriangle },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Feedback", href: "/admin/feedback", icon: MessageSquare },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Cog },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = isAdmin ? [...userLinks, ...adminLinks] : userLinks;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/raksha-logo.svg" alt="Raksha Alert" className="h-6 w-6 object-contain" />
            <span className="font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Raksha Alert</span>
          </Link>
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
              {(profile?.display_name || user?.email || "U")[0].toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-foreground truncate">{profile?.display_name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-background/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-8">
          <button className="lg:hidden mr-4 text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground flex-1" style={{ fontFamily: 'var(--font-display)' }}>
            {links.find((l) => l.href === location.pathname)?.label || "Dashboard"}
          </h1>
          <NotificationBell />
        </header>
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
