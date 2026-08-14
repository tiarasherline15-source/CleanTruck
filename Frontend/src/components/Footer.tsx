import { Link } from "react-router-dom";
import { Recycle, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-8 sm:py-12 px-4 sm:px-6">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg  text-foreground overflow-hidden">
                <img src="/favicon.ico" alt="CleanTrack logo" className="h-6 w-6 object-contain" />
              </div>
              <span className="text-xl font-bold">CleanTrack</span>
            </Link>
            <p className="text-sm text-primary-foreground/70 max-w-xs">
              Digital solution focused on improving coordination, accountability, and efficiency in waste collection services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
           
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Residential Collection</li>
              <li>Commercial Pickup</li>
              <li>Recycling Services</li>
              <li>Bulk Waste Removal</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-bold text-primary-foreground mb-3">Contact & Support</h2>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>Email: support@cleanTrack.com</li>
              <li>Phone: +254 740 561 299</li>
              <li>Address: Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-center text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} CleanTrack Waste Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;