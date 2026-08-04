import { Link } from "react-router-dom";
import { Recycle, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground text-foreground">
                <Recycle className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">WeMS</span>
            </Link>
            <p className="text-sm text-primary-foreground/70 max-w-xs">
              Streamlining waste collection for cleaner, healthier Kenyan communities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-primary-foreground transition-colors">Services</Link></li>
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact</Link></li>
            </ul>
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
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Nairobi, Kenya
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +254 700 123 456
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@wems.co.ke
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-center text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Waste Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;