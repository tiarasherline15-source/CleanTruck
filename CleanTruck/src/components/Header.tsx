import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, Menu, X } from "lucide-react";
import { useState, useCallback } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#about", label: "About" },
  ];

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-105 overflow-hidden">
            <img src="/favicon.ico" alt="CleanTruck logo" className="h-6 w-6 object-contain" />
          </div>
          <span className="text-xl font-bold text-foreground">CleanTruck</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild >
            <Link to="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="block px-4 py-2 rounded-lg text-sm font-medium transition-colors text-foreground hover:bg-muted cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button className="w-full" asChild>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;