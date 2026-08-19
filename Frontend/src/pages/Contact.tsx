import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Send,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      // In production, this would POST to /api/contact/
      await new Promise((r) => setTimeout(r, 1000));
      setSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });
    } catch {
      toast({
        title: "Failed to send",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#E1F5EE" }}>
      <Header />

      <main className="flex-1 py-12 sm:py-20">
        <div className="container px-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1
                className="text-3xl sm:text-4xl font-bold"
                style={{ color: "#0F6E56" }}
              >
                Get in Touch
              </h1>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                Have questions, feedback, or need assistance? We'd love to hear
                from you.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
              {/* Contact Info Cards */}
              <div className="space-y-4">
                <Card
                  className="border-[#b8e0d4]"
                  style={{ backgroundColor: "#F6FAFA" }}
                >
                  <CardContent className="flex items-start gap-4 p-5">
                    <div
                      className="flex h-10 w-10 items-center justify-center shrink-0 rounded-lg"
                      style={{ backgroundColor: "#E1F5EE" }}
                    >
                      <Mail className="h-5 w-5" style={{ color: "#0F6E56" }} />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#0F6E56" }}>
                        Email
                      </p>
                      <p className="text-sm text-muted-foreground">
                        support@cleantruck.com
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="border-[#b8e0d4]"
                  style={{ backgroundColor: "#F6FAFA" }}
                >
                  <CardContent className="flex items-start gap-4 p-5">
                    <div
                      className="flex h-10 w-10 items-center justify-center shrink-0 rounded-lg"
                      style={{ backgroundColor: "#E1F5EE" }}
                    >
                      <Phone className="h-5 w-5" style={{ color: "#0F6E56" }} />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#0F6E56" }}>
                        Phone
                      </p>
                      <p className="text-sm text-muted-foreground">
                        +254 700 123 456
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mon – Fri, 8 AM – 6 PM
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="border-[#b8e0d4]"
                  style={{ backgroundColor: "#F6FAFA" }}
                >
                  <CardContent className="flex items-start gap-4 p-5">
                    <div
                      className="flex h-10 w-10 items-center justify-center shrink-0 rounded-lg"
                      style={{ backgroundColor: "#E1F5EE" }}
                    >
                      <MapPin
                        className="h-5 w-5"
                        style={{ color: "#0F6E56" }}
                      />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#0F6E56" }}>
                        Office
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Westlands Business Park
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Nairobi, Kenya
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <Card
                className="border-[#b8e0d4] shadow-xl"
                style={{ backgroundColor: "#F6FAFA" }}
              >
                {submitted ? (
                  <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                    <CheckCircle2
                      className="h-14 w-14"
                      style={{ color: "#0F6E56" }}
                    />
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: "#0F6E56" }}
                    >
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground text-center max-w-sm">
                      Thank you for reaching out. Our team will review your
                      message and get back to you within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          subject: "",
                          message: "",
                        });
                      }}
                      className="border-[#b8e0d4] text-[#0F6E56]"
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <CardHeader>
                      <CardTitle
                        style={{ color: "#0F6E56" }}
                      >
                        Send a Message
                      </CardTitle>
                      <CardDescription style={{ color: "#6B9E8A" }}>
                        Fill out the form below and we'll respond as soon as
                        possible.
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor="name"
                            className="text-[#444441]"
                          >
                            Full Name
                          </Label>
                          <div className="relative">
                            <Input
                              id="name"
                              name="name"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={handleChange}
                              className="border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-[#444441]"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="subject"
                          className="text-[#444441]"
                        >
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help?"
                          value={formData.subject}
                          onChange={handleChange}
                          className="border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="message"
                          className="text-[#444441]"
                        >
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className="border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
                          required
                        />
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full bg-[#1D9E75] hover:bg-[#0F6E56] gap-2"
                        size="lg"
                        disabled={sending}
                      >
                        {sending ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
