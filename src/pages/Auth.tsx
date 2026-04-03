import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ShieldAlert, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type LoginMode = "user" | "admin";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Role-based redirect when already logged in
  useEffect(() => {
    if (!isLoading && user) {
      navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, displayName);
        toast({ title: "Account created!", description: "Check your email to confirm your account." });
      } else {
        await signIn(email, password);
        // Redirect happens via the useEffect above once roles are loaded
        toast({ title: "Signed in!", description: "Redirecting to your dashboard..." });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-4">
            <Shield className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              Raksha Alert
            </span>
          </a>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        {/* Role toggle tabs */}
        {!isSignUp && (
          <div className="flex rounded-xl bg-secondary/50 border border-border p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginMode("user")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                loginMode === "user"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="h-4 w-4" />
              User Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMode("admin")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                loginMode === "admin"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ShieldAlert className="h-4 w-4" />
              Admin Login
            </button>
          </div>
        )}

        <div className="gradient-card rounded-2xl border border-border p-8">
          {/* Mode indicator */}
          {!isSignUp && (
            <div className={cn(
              "flex items-center gap-2 mb-6 p-3 rounded-lg border text-sm",
              loginMode === "admin"
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-accent/10 border-accent/30 text-accent"
            )}>
              {loginMode === "admin" ? (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  Admin access — restricted to authorized personnel
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  User access — report incidents & view alerts
                </>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Create Account" : loginMode === "admin" ? "Sign In as Admin" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
