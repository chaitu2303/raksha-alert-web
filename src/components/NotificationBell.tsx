import { useState, useEffect, useRef } from "react";
import { Bell, AlertTriangle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Audio not supported
  }
};

const NotificationBell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Tables<"alerts">[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!user) return;

    const stored = localStorage.getItem(`raksha_read_${user.id}`);
    const storedSet = stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    setReadIds(storedSet);

    // Load recent alerts
    const loadAlerts = async () => {
      const { data } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((a) => !storedSet.has(a.id)).length);
        initialLoadDone.current = true;
      }
    };
    loadAlerts();

    // Deduplicated real-time subscription — unique channel name
    const seenIds = new Set<string>();
    const channel = supabase
      .channel(`bell-alerts-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload) => {
        const newAlert = payload.new as Tables<"alerts">;
        // Prevent duplicate processing
        if (seenIds.has(newAlert.id)) return;
        seenIds.add(newAlert.id);

        setNotifications((prev) => {
          if (prev.some((n) => n.id === newAlert.id)) return prev;
          return [newAlert, ...prev].slice(0, 10);
        });
        setUnreadCount((prev) => prev + 1);

        playNotificationSound();
        toast({
          title: `🚨 ${newAlert.title}`,
          description: newAlert.description?.slice(0, 100) || newAlert.category,
          variant: "destructive",
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadIds(allIds);
    setUnreadCount(0);
    if (user) {
      localStorage.setItem(`raksha_read_${user.id}`, JSON.stringify([...allIds]));
    }
  };

  const markRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      if (user) localStorage.setItem(`raksha_read_${user.id}`, JSON.stringify([...next]));
      return next;
    });
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const severityColor = (s: string) =>
    s === "high" ? "text-primary" : s === "medium" ? "text-yellow-500" : "text-muted-foreground";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl bg-card border border-border shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No notifications yet</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  "flex items-start gap-3 p-3 border-b border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors",
                  !readIds.has(n.id) && "bg-primary/5"
                )}
              >
                <AlertTriangle className={cn("h-4 w-4 mt-0.5 shrink-0", severityColor(n.severity))} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                {!readIds.has(n.id) && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
