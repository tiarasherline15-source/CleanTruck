import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Mail, Phone } from "lucide-react";

type VerificationMethod = "email" | "phone";

type Step = "identify" | "verify" | "reset" | "success";

const mockUsers = [
  { name: "Jane Wanjiku", email: "jane@example.com", phone: "+254712345678" },
  { name: "John Kariuki", email: "john@example.com", phone: "+254700123456" },
  { name: "Grace Achieng", email: "grace@example.com", phone: "+254734987654" },
];

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("identify");
  const [method, setMethod] = useState<VerificationMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpCode, setOtpCode] = useState("123456");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const findUser = () => {
    if (method === "email") {
      return mockUsers.find((user) => user.email.toLowerCase() === identifier.trim().toLowerCase());
    }

    return mockUsers.find((user) => user.phone === identifier.trim());
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setError("Please enter your email address or phone number.");
      return;
    }

    const matchedUser = findUser();
    if (!matchedUser) {
      setError("No account matches that email or phone number. Please try again.");
      return;
    }

    setOtpCode("123456");
    const deliveryTarget = method === "email" ? matchedUser.email : `${matchedUser.phone} via SMS`;
    setMessage(`OTP sent successfully to ${deliveryTarget}. Demo code: 123456`);
    setStep("verify");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your device.");
      return;
    }

    if (otp.trim() !== otpCode) {
      setError("Invalid OTP. Please use the demo code shown in the message.");
      return;
    }

    setMessage("OTP verified successfully. Set a new password below.");
    setStep("reset");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setMessage("Your password has been reset successfully. You can now sign in.");
    setStep("success");
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
                    placeholder={method === "email" ? "you@example.com" : "+254712345678"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                  />
                </div>

              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]" size="lg">
                  Send OTP
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
                  We sent your code to {method === "email" ? identifier : `${identifier} via SMS`}. Use the demo OTP: <strong>123456</strong>
                </p>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]" size="lg">
                  Verify OTP
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-[#1D9E75]"
                  onClick={() => setStep("identify")}
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
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#444441]">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]" size="lg">
                  Reset Password
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
