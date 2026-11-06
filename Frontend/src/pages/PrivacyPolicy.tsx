import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "Account & Identity Data: Full name, email address, phone number, role (resident, collector, or administrator), and optional profile picture.",
      "Location & Address Data: Physical pickup addresses, Nairobi collection zone, geocoded coordinates (latitude/longitude) for waste pickup requests, and real-time browser GPS coordinates while collectors are actively executing a collection route.",
      "Service & Usage Data: Waste pickup requests (waste type, priority, estimated/actual weight, scheduled times), route history, notification preferences, and messages submitted via our Contact form.",
      "Technical & Session Data: Authentication tokens (JWTs stored in browser session storage), IP addresses in server logs, and cookie consent preferences.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To schedule, assign, route, and complete residential and commercial waste collection requests.",
      "To provide live route navigation to collectors and status updates to residents and administrators.",
      "To send transactional notifications via email and SMS (such as welcome messages, OTP verification codes, pickup confirmations, and completion receipts).",
      "To generate aggregated, anonymized operational analytics and sector efficiency reports.",
    ],
  },
  {
    title: "3. Data Storage & Security",
    content: [
      "Your data is stored in secured PostgreSQL databases with password hashing, role-based access controls, and short-lived JSON Web Tokens (JWT).",
      "Authentication sessions are isolated per browser tab using sessionStorage and automatically cleared when you sign out or close your tab.",
      "We retain collection history and account records only for as long as your account remains active or as required by applicable environmental and municipal regulations.",
    ],
  },
  {
    title: "4. Third-Party Services",
    content: [
      "OpenStreetMap & Nominatim: Used for displaying interactive maps and geocoding pickup addresses.",
      "Resend / Email Providers: Used strictly to deliver transactional emails and password reset OTPs.",
      "Africa's Talking: Used strictly for SMS OTP verification and collection alerts.",
      "Cloudinary: Used for hosting uploaded user profile images.",
      "We never sell, rent, or trade your personal information to advertisers or data brokers.",
    ],
  },
  {
    title: "5. Cookies & Local Storage Policy",
    content: [
      "Strictly Necessary Storage: CleanTruck uses browser sessionStorage to keep you signed in during your active session and localStorage to remember your cookie consent choice.",
      "Optional Preferences & Analytics: Non-essential storage is only enabled if you choose 'Accept All' on our consent banner. You may clear your browser storage or change your consent preference at any time.",
    ],
  },
  {
    title: "6. Your Data Protection Rights",
    content: [
      "In accordance with the Kenya Data Protection Act, GDPR, and CCPA, you have the right to access, correct, export, or request deletion of your personal data.",
      "You can update your profile details and notification preferences directly from your Dashboard Settings, or request full account deletion by contacting our support team.",
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#E1F5EE" }}>
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container px-4 sm:px-6 max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            &larr; Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "#0F6E56" }}>
              Privacy & Cookie Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last Updated: November 6, 2026
            </p>
            <p className="mt-4 text-sm sm:text-base" style={{ color: "#444441" }}>
              CleanTruck ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains what personal data we collect, how it is stored and used, and your rights when using the CleanTruck Waste Management Platform.
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.title} className="border-[#b8e0d4]" style={{ backgroundColor: "#F6FAFA" }}>
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-lg sm:text-xl font-semibold" style={{ color: "#0F6E56" }}>
                    {section.title}
                  </h2>
                  <ul className="space-y-2 text-sm sm:text-base list-disc list-inside" style={{ color: "#444441" }}>
                    {section.content.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            <Card className="border-[#b8e0d4]" style={{ backgroundColor: "#F6FAFA" }}>
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold" style={{ color: "#0F6E56" }}>
                    Questions or Data Requests?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Contact our Data Protection Officer at support@cleantruck.com or via our Contact page.
                  </p>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shrink-0"
                  style={{ backgroundColor: "#1D9E75" }}
                >
                  Contact Support
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
