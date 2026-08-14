import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileSidebarProps {
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  brandName?: string;
  logoSrc?: string;
}

const MobileSidebar = ({
  navItems,
  activeTab,
  onTabChange,
  brandName = "CleanTruck",
  logoSrc = "/favicon-32x32.png",
}: MobileSidebarProps) => {
  const [open, setOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    onTabChange(tab);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-[#E1F5EE] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" style={{ color: "#0F6E56" }} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0" style={{ backgroundColor: "#0F6E56" }}>
        <SheetTitle className="sr-only">{brandName} Navigation</SheetTitle>
        <SheetDescription className="sr-only">Navigate through the {brandName} dashboard</SheetDescription>
        
        <div className="flex h-14 sm:h-16 items-center gap-2 border-b px-4 sm:px-6" style={{ borderColor: "#b8e0d4" }}>
          <img src={logoSrc} alt={`${brandName} logo`} className="h-7 w-7 sm:h-8 sm:w-8 rounded-md" />
          <span className="text-base sm:text-lg font-bold text-white">{brandName}</span>
        </div>
        
        <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id ? "" : "hover:bg-[#1D9E75]/20"
              }`}
              style={activeTab === item.id ? { backgroundColor: "#1D9E75", color: "white" } : { color: "#9FE1CB" }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: "#b8e0d4" }}>
          <Button variant="ghost" className="w-full justify-start gap-3" asChild style={{ color: "#6B9E8A" }}>
            <Link to="/">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
