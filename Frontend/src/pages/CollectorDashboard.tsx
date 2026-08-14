import { useState } from "react";
import { WelcomeCard } from "@/components/ui/WelcomeCard";
import MobileSidebar from "@/components/ui/MobileSidebar";
import NotificationDrawer from "@/components/ui/NotificationDrawer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import DashboardDialog from "@/components/ui/DashboardDialog";
import {
  Calendar, Clock, MapPin,
  CheckCircle2, LogOut, User,
  Home, Route, History, Settings, Navigation,
  Package, Timer, Phone, Play, Pause, Check, Bell
} from "lucide-react";

// Mock data for assigned pickups
const mockPickups = [
  { 
    id: 1, 
    address: "123 Green Lane, Sector 5", 
    resident: "John Doe",
    phone: "+1 234 567 890",
    wasteType: "General Waste", 
    scheduledTime: "08:00 AM",
    priority: "high",
    status: "pending",
    estimatedWeight: "15 kg"
  },
  { 
    id: 2, 
    address: "456 Eco Street, Sector 7", 
    resident: "Jane Smith",
    phone: "+1 234 567 891",
    wasteType: "Recyclables", 
    scheduledTime: "09:30 AM",
    priority: "normal",
    status: "pending",
    estimatedWeight: "8 kg"
  },
  { 
    id: 3, 
    address: "789 Clean Avenue, Sector 3", 
    resident: "Bob Wilson",
    phone: "+1 234 567 892",
    wasteType: "Organic Waste", 
    scheduledTime: "10:00 AM",
    priority: "normal",
    status: "pending",
    estimatedWeight: "12 kg"
  },
  { 
    id: 4, 
    address: "321 Waste Road, Sector 2", 
    resident: "Alice Brown",
    phone: "+1 234 567 893",
    wasteType: "E-Waste", 
    scheduledTime: "11:30 AM",
    priority: "low",
    status: "pending",
    estimatedWeight: "5 kg"
  },
];

const mockRoutes = [
  { id: 1, name: "Sector 5-7 Morning Route", stops: 8, distance: "12.5 km", estimatedTime: "2h 30m", status: "active" },
  { id: 2, name: "Sector 2-3 Afternoon Route", stops: 6, distance: "8.2 km", estimatedTime: "1h 45m", status: "upcoming" },
];

const mockHistory = [
  { id: 1, date: "2026-01-09", pickups: 12, weight: "156 kg", route: "Sector 5-7", duration: "2h 15m" },
  { id: 2, date: "2026-01-08", pickups: 10, weight: "134 kg", route: "Sector 2-3", duration: "1h 55m" },
  { id: 3, date: "2026-01-07", pickups: 14, weight: "178 kg", route: "Sector 5-7", duration: "2h 40m" },
  { id: 4, date: "2026-01-06", pickups: 11, weight: "145 kg", route: "Sector 2-3", duration: "2h 05m" },
  { id: 5, date: "2026-01-05", pickups: 9, weight: "112 kg", route: "Sector 5-7", duration: "1h 50m" },
];

const priorityConfig = {
  high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
  normal: { label: "Normal", className: "bg-[#b8e0d4] text-[#444441] border-[#b8e0d4]" },
  low: { label: "Low", className: "bg-[#E1F5EE] text-[#6B9E8A] border-[#E1F5EE]" },
};

const wasteTypeIcons: Record<string, string> = {
  "General Waste": "🗑️",
  "Recyclables": "♻️",
  "Organic Waste": "🌱",
  "E-Waste": "🔌",
};

const CollectorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [pickups, setPickups] = useState(mockPickups);
  const [isRouteActive, setIsRouteActive] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const completedPickups = pickups.filter(p => p.status === "completed").length;
  const pendingPickups = pickups.filter(p => p.status === "pending").length;
  const progressPercentage = (completedPickups / pickups.length) * 100;

  const stats = [
    { label: "Today's Pickups", value: pickups.length.toString(), icon: Package, color: "text-primary" },
    { label: "Completed", value: completedPickups.toString(), icon: CheckCircle2, color: "text-success" },
    { label: "Pending", value: pendingPickups.toString(), icon: Clock, color: "text-warning" },
    { label: "Total Distance", value: "20.7 km", icon: Navigation, color: "text-secondary" },
  ];

  const handleCompletePickup = (id: number) => {
    setPickups(prev => prev.map(p => 
      p.id === id ? { ...p, status: "completed" } : p
    ));
  };

  const handleSidebarClick = (tab: string) => {
    if (tab === "settings") {
      setSettingsOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "routes", label: "Route Management", icon: Route },
    { id: "history", label: "Collection History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E1F5EE" }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r hidden lg:block" style={{ backgroundColor: "#0F6E56", borderColor: "#b8e0d4" }}>
        <div className="flex h-16 items-center gap-2 border-b px-6" style={{ borderColor: "#b8e0d4" }}>
          <img src="/favicon-32x32.png" alt="CleanTruck favicon" className="h-8 w-8 rounded-md" />
          <div>
            <span className="text-lg font-bold text-white">CleanTruck</span>
            
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSidebarClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id ? "" : "hover:bg-[#1D9E75]/20"
              }`}
              style={activeTab === item.id ? { backgroundColor: "#1D9E75", color: "white" } : { color: "#9FE1CB" }}
            >
              <item.icon className="h-4 w-4" />
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
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 sm:px-6" style={{ backgroundColor: "#F6FAFA", borderBottomColor: "#b8e0d4" }}>
          <div className="flex items-center gap-2">
            <MobileSidebar
              navItems={navItems}
              activeTab={activeTab}
              onTabChange={handleSidebarClick}
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {isRouteActive ? (
              <Button size="sm" variant="destructive" className="gap-2" onClick={() => setIsRouteActive(false)}>
                <Pause className="h-4 w-4" />
                Pause Route
              </Button>
            ) : (
              <Button size="sm" className="gap-2 bg-[#1D9E75] text-white hover:bg-[#0F6E56]" onClick={() => setIsRouteActive(true)}>
                <Play className="h-4 w-4" />
                Start Route
              </Button>
            )}
            <button
              className="relative p-2 rounded-full hover:bg-[#E1F5EE] transition-colors"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-5 w-5" style={{ color: "#D97706" }} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#1D9E75]" />
            </button>
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#E1F5EE] transition-colors cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F6E56]">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: "#0F6E56" }}>Mike Johnson</span>
            </button>
          </div>
        </header>

        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              {/* Welcome Card */}
              <WelcomeCard userName="Mike" />

              {/* Stats Grid */}
              <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="border-[#b8e0d4]" style={{ backgroundColor: "#F6FAFA" }}>
                    <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-6">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center" style={{ color: "#1D9E75" }}>
                        <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold" style={{ color: "#0F6E56" }}>{stat.value}</p>
                        <p className="text-xs sm:text-sm" style={{ color: "#444441" }}>{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Route Progress Banner */}
              {isRouteActive && (
                <Card className="border-success/30 bg-success/5">
                  <CardContent className="flex items-center justify-between p-3 sm:p-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center animate-pulse shrink-0" style={{ color: "#0F6E56" }}>
                        <Navigation className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base text-success">Route Active</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Sector 5-7 Morning Route</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg sm:text-2xl font-bold">{completedPickups}/{pickups.length}</p>
                      <p className="text-[11px] sm:text-sm text-muted-foreground">Pickups Completed</p>
                    </div>
                  </CardContent>
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </Card>
              )}

              {/* Assigned Pickups */}
              <Card className="border-[#b8e0d4] bg-[#F6FAFA]">
                <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-6">
                  <div>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                      
                      Assigned Pickups
                    </CardTitle>
                    
                  </div>
                  <Badge variant="outline" className="text-xs sm:text-sm border-[#b8e0d4] bg-[#9FE1CB] text-[#0F6E56]">
                    {pendingPickups} remaining
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                {pickups.map((pickup) => (
                    <div 
                      key={pickup.id} 
                      className={`p-3 sm:p-4 rounded-xl border transition-all ${
                        pickup.status === "completed" 
                          ? "bg-success/5 border-success/20" 
                          : "bg-card hover:border-primary/30"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1">
                          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center text-xl sm:text-2xl shrink-0" style={{ color: "#1D9E75" }}>
                            {wasteTypeIcons[pickup.wasteType] || ""}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm sm:text-base" style={{ color: "#0F6E56" }}>{pickup.wasteType}</p>
                              <Badge variant="outline" className={priorityConfig[pickup.priority as keyof typeof priorityConfig].className}>
                                {priorityConfig[pickup.priority as keyof typeof priorityConfig].label}
                              </Badge>
                              {pickup.status === "completed" && (
                                <Badge className="bg-[#9FE1CB] text-[#0F6E56]">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Collected
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs sm:text-sm mt-1" style={{ color: "#444441" }}>
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{pickup.address}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
                              <span className="flex items-center gap-1" style={{ color: "#444441" }}>
                                <User className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{pickup.resident}</span>
                              </span>
                              <span className="flex items-center gap-1" style={{ color: "#444441" }}>
                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                {pickup.scheduledTime}
                              </span>
                              <span className="flex items-center gap-1" style={{ color: "#444441" }}>
                                <Package className="h-3.5 w-3.5 shrink-0" />
                                ~{pickup.estimatedWeight}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto sm:shrink-0">
                          <Button size="icon" variant="outline" className="h-8 w-8 sm:h-9 sm:w-9">
                            <Phone className="h-4 w-4" style={{ color: "#2563EB" }} />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 sm:h-9 sm:w-9">
                            <Navigation className="h-4 w-4" style={{ color: "#0EA5E9" }} />
                          </Button>
                          {pickup.status !== "completed" && (
                            <Button 
                              size="sm" 
                              className="gap-1 bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
                              onClick={() => handleCompletePickup(pickup.id)}
                            >
                              <Check className="h-4 w-4" style={{ color: "#059669" }} />
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                ))}
              </CardContent>
            </Card>
            </>
          )}

          {/* ROUTE MANAGEMENT TAB */}
          {activeTab === "routes" && (
            <Card className="border-[#b8e0d4] bg-[#F6FAFA]">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                      
                      Route Management
                    </CardTitle>
                    
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {mockRoutes.map((route) => (
                  <div 
                    key={route.id} 
                    className={`p-3 sm:p-5 rounded-xl border transition-all ${
                      route.status === "active" 
                        ? "border-[#b8e0d4]" 
                        : "bg-[#E1F5EE]/50 hover:border-primary/30"
                    }`}
                    style={route.status === "active" ? { backgroundColor: "#E1F5EE", borderColor: "#b8e0d4" } : undefined}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center shrink-0" style={{ color: route.status === "active" ? "#ffffff" : "#444441" }}>
                          <Route className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm sm:text-base" style={{ color: "#0F6E56" }}>{route.name}</p>
                            {route.status === "active" && (
                              <Badge className="bg-[#9FE1CB] text-[#0F6E56]">Active</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm" style={{ color: "#444441" }}>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              {route.stops} stops
                            </span>
                            <span className="flex items-center gap-1">
                              <Navigation className="h-3.5 w-3.5 shrink-0" />
                              {route.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Timer className="h-3.5 w-3.5 shrink-0" style={{ color: "#D97706" }} />
                              {route.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant={route.status === "active" ? "secondary" : "outline"} size="sm" className={`w-full sm:w-auto ${route.status === "active" ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56]" : ""}`}>
                        {route.status === "active" ? "View Map" : "Start Route"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* COLLECTION HISTORY TAB */}
          {activeTab === "history" && (
            <Card className="border-[#b8e0d4] bg-[#F6FAFA]">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                    
                    Collection History
                  </CardTitle>
                  
                </div>
                <Button variant="outline" size="sm">Export Report</Button>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                {/* Desktop Table */}
                <div className="overflow-x-auto hidden sm:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "#b8e0d4" }}>
                        <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#444441" }}>Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#444441" }}>Route</th>
                        <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#444441" }}>Pickups</th>
                        <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#444441" }}>Weight</th>
                        <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#444441" }}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockHistory.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-[#E1F5EE] transition-colors" style={{ borderColor: "#b8e0d4" }}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" style={{ color: "#7C3AED" }} />
                              <span className="font-medium" style={{ color: "#0F6E56" }}>{record.date}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4" style={{ color: "#444441" }}>{record.route}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="border-[#b8e0d4] bg-[#9FE1CB] text-[#0F6E56]">{record.pickups} pickups</Badge>
                          </td>
                          <td className="py-3 px-4 font-medium" style={{ color: "#0F6E56" }}>{record.weight}</td>
                          <td className="py-3 px-4" style={{ color: "#444441" }}>{record.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

               {/* Mobile Cards */}
                <div className="space-y-3 sm:hidden">
                  {mockHistory.map((record) => (
                    <div key={record.id} className="rounded-lg border border-[#b8e0d4] bg-[#F6FAFA] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" style={{ color: "#7C3AED" }} />
                          <span className="font-medium text-sm" style={{ color: "#0F6E56" }}>{record.date}</span>
                        </div>
                        <Badge variant="outline" className="border-[#b8e0d4] bg-[#9FE1CB] text-[#0F6E56] text-xs">{record.pickups} pickups</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: "#444441" }}>
                        <span>Route: {record.route}</span>
                        <span className="font-medium" style={{ color: "#0F6E56" }}>{record.weight}</span>
                      </div>
                      <div className="text-xs mt-1" style={{ color: "#444441" }}>Duration: {record.duration}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <NotificationDrawer open={notificationsOpen} onOpenChange={setNotificationsOpen} />

      {/* SETTINGS DIALOG */}
      <DashboardDialog
        open={settingsOpen}
        onOpenChange={(open) => {
          setSettingsOpen(open);
          if (!open) setActiveTab("overview");
        }}
        title="Settings"
      >
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <h4 className="font-medium" style={{ color: "#0F6E56" }}>Notifications</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: "#444441" }}>Email notifications</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 accent-[#1D9E75]" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: "#444441" }}>SMS notifications</span>
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 accent-[#1D9E75]" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm" style={{ color: "#444441" }}>Route updates</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 accent-[#1D9E75]" />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium" style={{ color: "#0F6E56" }}>Preferences</h4>
            <div className="space-y-2">
              <Label htmlFor="default-route">Default Route</Label>
              <Input id="default-route" placeholder="Enter your default route..." defaultValue="Sector 5-7" />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium" style={{ color: "#0F6E56" }}>Account</h4>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">Change Password</Button>
              <Button variant="outline" size="sm" className="text-[#dc2626] hover:text-[#dc2626]">Delete Account</Button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-2 sm:gap-3">
          <Button variant="outline" className="flex-1" onClick={() => {
            setSettingsOpen(false);
            setActiveTab("overview");
          }}>Cancel</Button>
          <Button className="flex-1 bg-[#1D9E75] text-white hover:bg-[#0F6E56]" onClick={() => {
            setSettingsOpen(false);
            setActiveTab("overview");
          }}>
            Save Changes
          </Button>
        </DialogFooter>
      </DashboardDialog>

      {/* USER PROFILE DIALOG */}
      <DashboardDialog
        open={profileOpen}
        onOpenChange={(open) => {
          setProfileOpen(open);
          if (!open) setActiveTab("overview");
        }}
        title="User Profile"
      >
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F6E56]">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold" style={{ color: "#0F6E56" }}>Mike Johnson</h3>
              <p className="text-sm" style={{ color: "#444441" }}>mike.johnson@example.com</p>
              <Badge variant="secondary" className="mt-2 bg-[#E1F5EE] text-[#0F6E56]">Collector</Badge>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4" style={{ borderColor: "#b8e0d4" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Phone</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>+254 700 987 654</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Zone</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>Sector 5-7</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Member Since</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>January 2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Total Collections</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>248</span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-2 sm:gap-3">
          <Button variant="outline" className="flex-1" onClick={() => {
            setProfileOpen(false);
            setActiveTab("overview");
          }}>Close</Button>
          <Button className="flex-1 bg-[#1D9E75] text-white hover:bg-[#0F6E56]" onClick={() => {
            setProfileOpen(false);
            setSettingsOpen(true);
            setActiveTab("settings");
          }}>
            Edit Profile
          </Button>
        </DialogFooter>
      </DashboardDialog>
    </div>
  );
};

export default CollectorDashboard;