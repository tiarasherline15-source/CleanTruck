import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const CONSENT_STORAGE_KEY = "cleantruck_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!saved) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (choice: "all" | "essential") => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ choice, timestamp: new Date().toISOString() })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4"
    >
      <div
        className="max-w-5xl mx-auto rounded-xl border shadow-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{ backgroundColor: "#F6FAFA", borderColor: "#b8e0d4" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0 mt-0.5"
            style={{ backgroundColor: "#E1F5EE" }}
          >
            <Cookie className="h-5 w-5" style={{ color: "#0F6E56" }} />
          </div>
          <div className="text-xs sm:text-sm space-y-1" style={{ color: "#444441" }}>
            <p className="font-semibold text-sm sm:text-base" style={{ color: "#0F6E56" }}>
              Cookie & Privacy Notice
            </p>
            <p className="leading-relaxed">
              We use strictly necessary session storage to keep you signed in and optional cookies/storage to improve route maps and service reliability. Read our{" "}
              <Link to="/privacy-policy" className="underline font-medium" style={{ color: "#1D9E75" }}>
                Privacy & Cookie Policy
              </Link>{" "}
              and{" "}
              <Link to="/terms" className="underline font-medium" style={{ color: "#1D9E75" }}>
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="border-[#b8e0d4] text-[#0F6E56] hover:bg-[#E1F5EE]"
            onClick={() => handleConsent("essential")}
          >
            Essential Only
          </Button>
          <Button
            size="sm"
            className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white"
            onClick={() => handleConsent("all")}
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
