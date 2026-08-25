import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const roleRedirect: Record<string, string> = {
  resident: "/dashboard",
  collector: "/collector",
  admin: "/admin",
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      // After login, get user from sessionStorage
      const stored = sessionStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      const redirectPath = roleRedirect[user?.role] || "/dashboard";
      toast.success("Logged in successfully!");
      navigate(redirectPath, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-3 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-4 sm:space-y-6 animate-scale-in">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="border-border/50 shadow-xl" style={{ backgroundColor: "#F6FAFA" }}>
          <CardHeader className="text-center space-y-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold" style={{ color: "#0F6E56" }}>
                Welcome Back
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-2" style={{ color: "#6B9E8A" }}>
                
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#444441]">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B9E8A" }} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[#444441]">
                    Password
                  </Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-[#1D9E75] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B9E8A" }} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#1D9E75] font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;