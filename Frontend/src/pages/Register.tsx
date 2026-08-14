import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, User, Phone, MapPin, ArrowLeft } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                      placeholder="John Doe"
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
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="pl-10 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#444441]">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B9E8A" }} />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className="pl-10 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-[#1D9E75] hover:bg-[#0F6E56]" size="lg">
                Create Account
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