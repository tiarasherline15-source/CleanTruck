import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Mail, Phone, Loader2, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";

type VerificationMethod = "email" | "phone";

type Step = "identify" | "verify" | "reset" | "success";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("identify");
  const [method, setMethod] = useState<VerificationMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setError("Please enter your email address or phone number.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password/", {
        identifier: cleanIdentifier,
        method,
      });
      setMessage(`OTP sent successfully to your ${method === "email" ? "email" : "phone via SMS"}.`);
      setStep("verify");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send OTP. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your device.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/verify-otp/", {
        identifier: identifier.trim(),
        code: otp.trim(),
        method,
      });
      setMessage("OTP verified successfully. Set a new password below.");
      setStep("reset");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid OTP. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password/", {
        identifier: identifier.trim(),
        code: otp.trim(),
        method,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage("Your password has been reset successfully. You can now sign in.");
      setStep("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep("identify");
    setMethod("email");
    setIdentifier("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-3 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-4 sm:space-y-6 animate-scale-in">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <Card className="border-border/50 shadow-xl" style={{ backgroundColor: "#F6FAFA" }}>
          <CardHeader className="text-center space-y-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold" style={{ color: "#0F6E56" }}>
                {step === "identify" && "Reset Password"}
                {step === "verify" && "Verify Your Identity"}
                {step === "reset" && "Create New Password"}
                {step === "success" && "Password Updated"}
              </CardTitle>
              <CardDescription className="mt-2 text-sm sm:text-base" style={{ color: "#6B9E8A" }}>
                {step === "identify" && "Choose how you would like to receive your one-time password."}
                {step === "verify" && "Enter the one-time password sent to your email or phone via SMS."}
                {step === "reset" && "Set a strong password to protect your account."}
                {step === "success" && "Your password has been changed successfully."}
              </CardDescription>
            </div>
          </CardHeader>

          {error && (
            <div className="mx-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mx-6 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {step === "identify" && (
            <form onSubmit={handleSendOtp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#444441]">Verification method</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={method === "email" ? "default" : "outline"}
                      className={method === "email" ? "bg-[#1D9E75] hover:bg-[#0F6E56]" : "border-[#b8e0d4] text-[#0F6E56]"}
                      onClick={() => setMethod("email")}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={method === "phone" ? "default" : "outline"}
                      className={method === "phone" ? "bg-[#1D9E75] hover:bg-[#0F6E56]" : "border-[#b8e0d4] text-[#0F6E56]"}
                      onClick={() => setMethod("phone")}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Phone (SMS)
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-[#444441]">
                    {method === "email" ? "Email address" : "Phone number for SMS"}
                  </Label>
                  <Input
                    id="identifier"
                    type={method === "email" ? "email" : "tel"}
                    autoComplete={method === "email" ? "email" : "tel"}
                    placeholder={method === "email" ? "you@example.com" : "+254712345678"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                  />
                </div>

              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerifyOtp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-[#444441]">
                    One-Time Password
                  </Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75] tracking-[0.2em]"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  We sent your code to {method === "email" ? identifier : `${identifier} via SMS`}.
                </p>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-[#1D9E75]"
                  onClick={() => {
                    setStep("identify");
                    setOtp("");
                    setError("");
                    setMessage("");
                  }}
                >
                  Change method
                </Button>
              </CardFooter>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-[#444441]">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#444441]">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
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
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resetting password...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </CardFooter>
            </form>
          )}

          {step === "success" && (
            <CardContent className="space-y-4 pb-6">
              <div className="flex justify-center">
                <CheckCircle2 className="h-12 w-12" style={{ color: "#0F6E56" }} />
              </div>
              <p className="text-center text-[#0F6E56] font-medium">{message}</p>
              <div className="flex flex-col gap-3">
                <Link to="/login" className="text-center">
                  <Button className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]">Go to Login</Button>
                </Link>
                <Button type="button" variant="outline" className="w-full border-[#b8e0d4] text-[#0F6E56]" onClick={resetForm}>
                  Reset again
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
