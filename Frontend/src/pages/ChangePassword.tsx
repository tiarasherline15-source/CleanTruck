import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ChangePassword = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const mustChange = user?.must_change_password === true;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBack = () => {
    const roleRedirect: Record<string, string> = { admin: "/admin", collector: "/collector", resident: "/dashboard" };
    navigate(roleRedirect[user?.role || "resident"], { replace: true });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: Record<string, string> = {
        new_password: newPassword,
        confirm_password: confirmPassword,
      };
      if (!mustChange) {
        payload.current_password = currentPassword;
      }
      const updatedUser = await api.post<typeof user>("/users/me/change-password/", payload);
      if (updatedUser) updateUser(updatedUser);
      toast.success("Password changed successfully.");
      if (mustChange) {
        toast.info("Please sign in with your new password.");
        logout();
        navigate("/login", { replace: true });
      } else {
        const roleRedirect: Record<string, string> = { admin: "/admin", collector: "/collector", resident: "/dashboard" };
        navigate(roleRedirect[user?.role || "resident"], { replace: true });
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Unable to change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md" style={{ backgroundColor: "#F6FAFA" }}>
        <CardHeader>
          {!mustChange && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </button>
          )}
          <CardTitle style={{ color: "#0F6E56" }}>
            {mustChange ? "Set your password" : "Change password"}
          </CardTitle>
          <CardDescription>
            {mustChange
              ? "Your administrator created this account with a temporary password. Choose a private password to continue."
              : "Enter your current password and choose a new one."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!mustChange && (
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current-password"
                    type={showCurrent ? "text" : "password"}
                    autoComplete="current-password"
                    className="pl-10 pr-10"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    {showCurrent ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  className="pr-10"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  className="pr-10"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Change password
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;