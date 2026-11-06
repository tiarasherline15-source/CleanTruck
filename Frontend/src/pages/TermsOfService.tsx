import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    body: "By registering for an account, scheduling a pickup, or accessing the CleanTruck Waste Management Platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the platform.",
  },
  {
    title: "2. Platform Services & User Responsibilities",
    body: "CleanTruck connects residents, waste collectors, and municipal/platform administrators to coordinate waste collection across designated Nairobi zones. Residents agree to provide accurate pickup addresses, valid contact details, and properly sorted waste (General Waste, Recyclables, Organic Waste, or E-Waste). Collectors agree to follow safety regulations, update route statuses accurately, and use resident contact details solely for fulfilling assigned pickups.",
  },
  {
    title: "3. Prohibited Conduct & Hazardous Materials",
    body: "Users may not schedule pickups for unapproved hazardous, medical, or toxic industrial waste unless explicitly authorized. You agree not to submit false pickup requests, impersonate other users, interfere with platform security, or scrape data from CleanTruck.",
  },
  {
    title: "4. Intellectual Property",
    body: "All software, branding, logos, UI designs, route management workflows, and content on CleanTruck are the intellectual property of CleanTruck and its licensors. You may not copy, modify, distribute, or reverse-engineer any part of the platform without prior written consent.",
  },
  {
    title: "5. Limitation of Liability & Service Availability",
    body: "CleanTruck provides scheduling, routing, and tracking tools on an 'as-is' and 'as-available' basis. While we strive for timely collections and accurate map geocoding, we are not liable for delays caused by traffic, weather, third-party map inaccuracies, or collector vehicle breakdowns. To the maximum extent permitted by law, CleanTruck's liability is limited to the fees paid (if any) for the affected collection service.",
  },
  {
    title: "6. Account Termination & Governing Law",
    body: "We reserve the right to suspend or terminate accounts that violate these Terms or abuse collection services. These Terms are governed by the laws of the Republic of Kenya.",
  },
];

const TermsOfService = () => {
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
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last Updated: November 6, 2026
            </p>
            <p className="mt-4 text-sm sm:text-base" style={{ color: "#444441" }}>
              Please read these Terms & Conditions carefully before using the CleanTruck Waste Management Platform.
            </p>
          </div>

          <div className="space-y-6">
            {termsSections.map((section) => (
              <Card key={section.title} className="border-[#b8e0d4]" style={{ backgroundColor: "#F6FAFA" }}>
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-lg sm:text-xl font-semibold" style={{ color: "#0F6E56" }}>
                    {section.title}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#444441" }}>
                    {section.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
