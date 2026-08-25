import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, User, Phone, MapPin, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const roleRedirect: Record<string, string> = {
  resident: "/dashboard",
  collector: "/collector",
  admin: "/admin",
};

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "#DC2626" };
  if (score <= 3) return { score, label: "Fair", color: "#D97706" };
  if (score <= 4) return { score, label: "Good", color: "#1D9E75" };
  return { score, label: "Strong", color: "#0F6E56" };
}

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zone: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const nameParts = formData.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      await register({
        username: formData.email,
        email: formData.email,
        password: formData.password,
        first_name: firstName,
        last_name: lastName,
        phone: formData.phone,
        address: formData.address,
        zone: formData.zone,
        role: "resident",
      });
      // After auto-login, navigate to resident dashboard
      const stored = sessionStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      const redirectPath = roleRedirect[user?.role] || "/dashboard";
      toast.success("Account created successfully!");
      navigate(redirectPath, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-3 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg space-y-4 sm:space-y-6 animate-scale-in">
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
                Create Account
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-2" style={{ color: "#6B9E8A" }}>
                
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#444441]">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B9E8A" }} />
                    <Input
                      id="name"
                      placeholder="samantha miller"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="pl-10 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#444441]">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B9E8A" }} />
                    <Input
                      id="phone"
                      placeholder="+254 700 123 456"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="pl-10 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                      required
                    />
                  </div>
                </div>
              </div>

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
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="pl-10 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-[#444441]">
                  Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B9E8A" }} />
                  <Input
                    id="address"
                    placeholder="123 Main Street, Westlands"
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="pl-10 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone" className="text-[#444441]">
                  Collection Zone
                </Label>
                <Select onValueChange={(value) => handleChange("zone", value)}>
                  <SelectTrigger className="border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]">
                    <SelectValue placeholder="Select your zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="westlands">Westlands</SelectItem>
                    <SelectItem value="kilimani">Kilimani</SelectItem>
                    <SelectItem value="kileleshwa">Kileleshwa</SelectItem>
                    <SelectItem value="lavington">Lavington</SelectItem>
                    <SelectItem value="karen">Karen</SelectItem>
                    <SelectItem value="langata">Lang'ata</SelectItem>
                    <SelectItem value="upperhill">Upper Hill</SelectItem>
                    <SelectItem value="cbd">CBD</SelectItem>
                    <SelectItem value="riruta">Riruta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#444441]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B9E8A" }} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
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
                  {formData.password.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-colors duration-300"
                            style={{
                              backgroundColor: i <= passwordStrength.score ? passwordStrength.color : "#e5e7eb",
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                        {passwordStrength.score <= 2 && ": add uppercase, numbers, and symbols"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#444441]">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B9E8A" }} />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-[#1D9E75] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;