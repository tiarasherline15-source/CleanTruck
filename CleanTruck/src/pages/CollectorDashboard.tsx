import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Recycle, Calendar, Truck, Clock, MapPin,
  CheckCircle2, AlertCircle, LogOut, User,
  Home, Route, History, Settings, Navigation,
  Package, Timer, Phone, Play, Pause, Check
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
  normal: { label: "Normal", className: "bg-primary/10 text-primary border-primary/20" },
  low: { label: "Low", className: "bg-muted text-muted-foreground border-muted" },
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

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "pickups", label: "Assigned Pickups", icon: Package },
    { id: "routes", label: "Route Management", icon: Route },
    { id: "history", label: "Collection History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card hidden lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold">CleanTruck</span>
            <p className="text-xs text-muted-foreground">Collector Portal</p>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div>
            <h1 className="text-xl font-semibold">Welcome, Mike 🚛</h1>
            <p className="text-sm text-muted-foreground">Today is January 10, 2026</p>
          </div>
          <div className="flex items-center gap-3">
            {isRouteActive ? (
              <Button size="sm" variant="destructive" className="gap-2" onClick={() => setIsRouteActive(false)}>
                <Pause className="h-4 w-4" />
                Pause Route
              </Button>
            ) : (
              <Button size="sm" className="gap-2 bg-success hover:bg-success/90" onClick={() => setIsRouteActive(true)}>
                <Play className="h-4 w-4" />
                Start Route
              </Button>
            )}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <User className="h-5 w-5" />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Route Progress Banner */}
          {isRouteActive && (
            <Card className="border-success/30 bg-success/5">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success text-success-foreground animate-pulse">
                    <Navigation className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-success">Route Active</p>
                    <p className="text-sm text-muted-foreground">Sector 5-7 Morning Route</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{completedPickups}/{pickups.length}</p>
                  <p className="text-sm text-muted-foreground">Pickups Completed</p>
                </div>
              </CardContent>
              <div className="px-4 pb-4">
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Assigned Pickups */}
          {(activeTab === "overview" || activeTab === "pickups") && (
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Assigned Pickups
                  </CardTitle>
                  <CardDescription>Your scheduled waste collections for today</CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  {pendingPickups} remaining
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {pickups.map((pickup) => (
                  <div 
                    key={pickup.id} 
                    className={`p-4 rounded-xl border transition-all ${
                      pickup.status === "completed" 
                        ? "bg-success/5 border-success/20" 
                        : "bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                          {wasteTypeIcons[pickup.wasteType] || "🗑️"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold">{pickup.wasteType}</p>
                            <Badge variant="outline" className={priorityConfig[pickup.priority as keyof typeof priorityConfig].className}>
                              {priorityConfig[pickup.priority as keyof typeof priorityConfig].label}
                            </Badge>
                            {pickup.status === "completed" && (
                              <Badge className="bg-success text-success-foreground">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Collected
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {pickup.address}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <User className="h-3.5 w-3.5" />
                              {pickup.resident}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {pickup.scheduledTime}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Package className="h-3.5 w-3.5" />
                              ~{pickup.estimatedWeight}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="h-9 w-9">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-9 w-9">
                          <Navigation className="h-4 w-4" />
                        </Button>
                        {pickup.status !== "completed" && (
                          <Button 
                            size="sm" 
                            className="gap-1 bg-success hover:bg-success/90"
                            onClick={() => handleCompletePickup(pickup.id)}
                          >
                            <Check className="h-4 w-4" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Route Management */}
          {(activeTab === "overview" || activeTab === "routes") && (
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-secondary" />
                      Route Management
                    </CardTitle>
                    <CardDescription>Your assigned collection routes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRoutes.map((route) => (
                  <div 
                    key={route.id} 
                    className={`p-5 rounded-xl border transition-all ${
                      route.status === "active" 
                        ? "border-success/30 bg-success/5" 
                        : "bg-muted/30 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          route.status === "active" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          <Route className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{route.name}</p>
                            {route.status === "active" && (
                              <Badge className="bg-success text-success-foreground">Active</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {route.stops} stops
                            </span>
                            <span className="flex items-center gap-1">
                              <Navigation className="h-3.5 w-3.5" />
                              {route.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Timer className="h-3.5 w-3.5" />
                              {route.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant={route.status === "active" ? "secondary" : "outline"} size="sm">
                        {route.status === "active" ? "View Map" : "Start Route"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Collection History */}
          {(activeTab === "overview" || activeTab === "history") && (
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-accent" />
                    Collection History
                  </CardTitle>
                  <CardDescription>Your past collection records</CardDescription>
                </div>
                <Button variant="outline" size="sm">Export Report</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Route</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Pickups</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Weight</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockHistory.map((record) => (
                        <tr key={record.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{record.date}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{record.route}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{record.pickups} pickups</Badge>
                          </td>
                          <td className="py-3 px-4 font-medium">{record.weight}</td>
                          <td className="py-3 px-4 text-muted-foreground">{record.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollectorDashboard;