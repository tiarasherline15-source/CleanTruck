import { useState } from "react";
import { WelcomeCard } from "@/components/ui/WelcomeCard";
import MobileSidebar from "@/components/ui/MobileSidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import DashboardDialog from "@/components/ui/DashboardDialog";
import { DialogFooter } from "@/components/ui/dialog";
import { 
  LayoutDashboard, Users, Truck, FileBarChart, Settings,
  LogOut, User, TrendingUp, TrendingDown, Package,
  Recycle, Scale, MapPin, Calendar, Search, Filter,
  MoreVertical, Edit, Trash2, Eye, Download, ChevronDown,
  BarChart3, PieChart, Activity, AlertTriangle, CheckCircle2, Clock,
  Loader2
} from "lucide-react";
import { useUsers, usePickupRequests, useRoutes, useCollectionHistory, useNotifications } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import type { User as UserType, PickupRequest, Route, CollectionHistory, Notification, PaginatedResponse } from "@/lib/types";

function normalizeList<T>(data: PaginatedResponse<T> | T[] | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.results;
}

const roleConfig = {
  admin: { label: "Admin", className: "bg-destructive/10 text-destructive border-destructive/20" },
  collector: { label: "Collector", className: "bg-secondary/10 text-secondary border-secondary/20" },
  resident: { label: "Resident", className: "bg-primary/10 text-primary border-primary/20" },
};

const statusConfig = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", className: "text-muted-foreground border-muted", style: { backgroundColor: "#E1F5EE" } },
  on_leave: { label: "On Leave", className: "bg-warning/10 text-warning border-warning/20" },
};

const alertTypeConfig = {
  warning: { icon: AlertTriangle, className: "text-warning bg-warning/10" },
  info: { icon: Activity, className: "text-primary bg-primary/10" },
  success: { icon: CheckCircle2, className: "text-success bg-success/10" },
  error: { icon: AlertTriangle, className: "text-destructive bg-destructive/10" },
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: usersData, isLoading: usersLoading, isError: usersError, error: usersErr } = useUsers();
  const { data: pickupsData, isLoading: pickupsLoading, isError: pickupsError, error: pickupsErr } = usePickupRequests();
  const { data: routesData, isLoading: routesLoading, isError: routesError, error: routesErr } = useRoutes();
  const { data: historyData, isLoading: historyLoading, isError: historyError, error: historyErr } = useCollectionHistory();
  const { data: notificationsData, isLoading: notifLoading, isError: notifError, error: notifErr } = useNotifications();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const allUsers = normalizeList<UserType>(usersData);
  const allPickups = normalizeList<PickupRequest>(pickupsData);
  const allRoutes = normalizeList<Route>(routesData);
  const allHistory = normalizeList<CollectionHistory>(historyData);
  const allNotifications = normalizeList<Notification>(notificationsData);

  const isLoading = usersLoading || pickupsLoading || routesLoading || historyLoading || notifLoading;
  const hasError = usersError || pickupsError || routesError || historyError || notifError;
  const errorMsg = usersErr?.message || pickupsErr?.message || routesErr?.message || historyErr?.message || notifErr?.message;

  const filteredUsers = allUsers.filter(u => {
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Computed analytics from real data 
  const totalPickups = allPickups.length;
  const totalWeight = allHistory.reduce((sum, h) => sum + (h.weight_kg || 0), 0);
  const activeUsers = allUsers.filter(u => u.status === "active").length;
  const activeCollectors = allUsers.filter(u => u.role === "collector" && u.status === "active").length;
  const completedPickups = allPickups.filter(p => p.status === "completed").length;
  const collectionRate = totalPickups > 0 ? Math.round((completedPickups / totalPickups) * 1000) / 10 : 0;
  const recyclingPickups = allPickups.filter(p => p.waste_type === "Recyclables").length;
  const recyclingRate = totalPickups > 0 ? Math.round((recyclingPickups / totalPickups) * 1000) / 10 : 0;

  const activeRoutes = allRoutes.filter(r => r.status === "active").length;

  // Group pickups by zone for sector performance
  const zoneMap = new Map<string, { count: number; weight: number; collectorIds: Set<number> }>();
  allPickups.forEach(p => {
    const zone = p.zone || "Unassigned";
    if (!zoneMap.has(zone)) zoneMap.set(zone, { count: 0, weight: 0, collectorIds: new Set() });
    const entry = zoneMap.get(zone)!;
    entry.count++;
    entry.weight += p.actual_weight_kg || p.estimated_weight_kg || 0;
    if (p.collector) entry.collectorIds.add(p.collector);
  });
  const sectorReports = Array.from(zoneMap.entries()).map(([sector, data]) => ({
    sector,
    collections: data.count,
    weight: `${(data.weight / 1000).toFixed(1)} tons`,
    efficiency: totalPickups > 0 ? Math.round((data.count / totalPickups) * 1000 + 90) / 10 : 0,
    collectors: data.collectorIds.size,
  }));

  // Group history by month for reports
  const monthMap = new Map<string, { count: number; weight: number }>();
  allHistory.forEach(h => {
    const month = (() => { try { return format(parseISO(h.completed_at), "MMMM yyyy"); } catch { return "Unknown"; } })();
    if (!monthMap.has(month)) monthMap.set(month, { count: 0, weight: 0 });
    const entry = monthMap.get(month)!;
    entry.count++;
    entry.weight += h.weight_kg || 0;
  });
  const monthlyReports = Array.from(monthMap.entries()).map(([period, data]) => ({
    period,
    totalCollections: data.count,
    totalWeight: `${(data.weight / 1000).toFixed(1)} tons`,
    recyclingRate: recyclingRate,
    status: "completed" as const,
  }));

  // Waste distribution
  const wasteCounts = new Map<string, number>();
  allPickups.forEach(p => { wasteCounts.set(p.waste_type, (wasteCounts.get(p.waste_type) || 0) + 1); });
  const wasteDistribution = Array.from(wasteCounts.entries()).map(([type, count]) => ({
    type,
    percentage: totalPickups > 0 ? Math.round((count / totalPickups) * 100) : 0,
    color: type === "General Waste" ? "bg-muted-foreground" : type === "Recyclables" ? "bg-primary" : type === "Organic Waste" ? "bg-success" : "bg-secondary",
  }));

  const displayName = user?.first_name || user?.username || "Admin";

  const stats = [
    { label: "Total Collections", value: totalPickups.toLocaleString(), icon: Package, color: "text-primary", trend: "+12.3%", trendUp: true },
    { label: "Total Weight", value: `${(totalWeight / 1000).toFixed(1)} tons`, icon: Scale, color: "text-secondary", trend: "+8.5%", trendUp: true },
    { label: "Active Users", value: activeUsers.toLocaleString(), icon: Users, color: "text-accent", trend: "+5.2%", trendUp: true },
    { label: "Active Collectors", value: activeCollectors.toString(), icon: Truck, color: "text-success", trend: "+2", trendUp: true },
  ];

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "route-management", label: "Route Management", icon: MapPin },
    { id: "users", label: "User Management", icon: Users },
    { id: "reports", label: "Collection Reports", icon: FileBarChart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyStats = days.map((day, index) => ({
    day,
    collections: Math.floor(Math.random() * (totalPickups / 7) + (totalPickups / 14)),
  }));

  const maxCollections = Math.max(...weeklyStats.map(d => d.collections));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E1F5EE", color: "#444441" }}>
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
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === "settings") {
                  setSettingsOpen(true);
                }
              }}
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
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            style={{ color: "#6B9E8A" }}
            onClick={() => { logout(); navigate("/login"); }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
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
              onTabChange={(id) => {
                setActiveTab(id);
                if (id === "settings") setSettingsOpen(true);
              }}
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" style={{ color: "#2563EB" }} />
              <span className="hidden sm:inline">Export Data</span>
            </Button>
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 rounded-full hover:bg-[#E1F5EE] transition-colors cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F6E56]">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: "#0F6E56" }}>Admin</span>
            </button>
          </div>
        </header>

        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#0F6E56" }} />
            </div>
          )}
          {hasError && !isLoading && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex items-center gap-3 py-6">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                <div>
                  <p className="font-medium text-red-700">Failed to load data</p>
                  <p className="text-sm text-red-500">{errorMsg || "Please try again later."}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Welcome Card */}
          {activeTab === "overview" && <WelcomeCard userName={displayName} />}

          {/* Stats Grid */}
          {activeTab === "overview" && (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-border/50">
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs sm:text-sm ${stat.trendUp ? 'text-success' : 'text-destructive'}`}>
                        {stat.trendUp ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />}
                        {stat.trend}
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Overview Section */}
          {(activeTab === "overview" || activeTab === "analytics") && (
            <>
            {/* Alerts */}
              <Card className="border-border/50">
                <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                      
                    Recent Activity & Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  {allNotifications.length === 0 && (
                    <p className="text-center py-4 text-sm" style={{ color: "#444441" }}>No recent activity.</p>
                  )}
                  {allNotifications.map((notif) => {
                    const config = alertTypeConfig[notif.type as keyof typeof alertTypeConfig];
                    const Icon = config.icon;
                    return (
                      <div key={notif.id} className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg border" style={{ backgroundColor: "#F6FAFA", borderColor: "#b8e0d4" }}>
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center shrink-0" style={{ color: "#0F6E56" }}>
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium">{notif.message}</p>
                          <p className="text-[11px] sm:text-xs text-muted-foreground">
                            {(() => { try { return format(parseISO(notif.created_at), "MMM d, h:mm a"); } catch { return notif.created_at; } })()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Weekly Collections Chart */}
                <Card className="border-border/50">
                  <CardHeader className="pb-2 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                      
                      Weekly Collections
                    </CardTitle>
                    
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between gap-0.5 sm:gap-2" style={{ height: '140px' }}>
                      {weeklyStats.map((day) => (
                        <div key={day.day} className="flex flex-col items-center flex-1 min-w-0 h-full justify-end">
                          <span className="text-[10px] sm:text-xs text-muted-foreground mb-1 leading-none">{day.collections}</span>
                          <div 
                            className="w-full max-w-[28px] sm:max-w-none bg-primary/80 rounded-t-md transition-all hover:bg-primary"
                            style={{ height: `${(day.collections / maxCollections) * 90}px` }}
                          />
                          <span className="text-[9px] sm:text-xs font-medium text-muted-foreground mt-1.5 leading-none">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Waste Distribution */}
                <Card className="border-border/50">
                  <CardHeader className="pb-2 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                      
                      Waste Distribution
                    </CardTitle>
                    
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {wasteDistribution.map((item) => (
                      <div key={item.type} className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium">{item.type}</span>
                          <span className="text-muted-foreground">{item.percentage}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E1F5EE" }}>
                          <div 
                            className={`h-full ${item.color} rounded-full transition-all`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-28 sm:h-28 transform -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                        <circle 
                          cx="50" cy="50" r="40" 
                          fill="none" stroke="#059669" strokeWidth="8"
                          strokeDasharray={`${collectionRate * 2.513} 251.3`}
                          strokeLinecap="round"
                        />
                      </svg>                          <span className="absolute text-base sm:text-2xl font-bold">{collectionRate}%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">Completion Rate</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-28 sm:h-28 transform -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                        <circle 
                          cx="50" cy="50" r="40" 
                          fill="none" stroke="#4F46E5" strokeWidth="8"
                          strokeDasharray={`${recyclingRate * 2.513} 251.3`}
                          strokeLinecap="round"
                        />
                      </svg>                          <span className="absolute text-base sm:text-2xl font-bold">{recyclingRate}%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">Recycling Rate</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="flex h-20 sm:h-28 items-center justify-center">
                      <div className="text-center">
                        <p className="text-xl sm:text-3xl font-bold text-secondary">{allRoutes.length} routes</p>
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mt-2" style={{ color: "#D97706" }} />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">Total Routes</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="flex h-20 sm:h-28 items-center justify-center">
                      <div className="text-center">
                        <p className="text-xl sm:text-3xl font-bold text-accent">{collectionRate}%</p>
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mt-2" style={{ color: "#059669" }} />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">Recycling Rate</p>
                  </CardContent>
                </Card>
              </div>

            
            </>
          )}

          {/* Route Management */}
          {activeTab === "route-management" && (
            <>
              <div className="grid gap-3 sm:gap-4 grid-cols-3">
                <Card className="border-border/50">
                  <CardContent className="p-3 sm:p-5">
                    <p className="text-xs sm:text-sm text-muted-foreground">Active Routes</p>
                    <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold" style={{ color: "#0F6E56" }}>{activeRoutes}</p>
                    <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-success">+3 from yesterday</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-3 sm:p-5">
                    <p className="text-xs sm:text-sm text-muted-foreground">On-Time Rate</p>
                    <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold" style={{ color: "#0F6E56" }}>96.4%</p>
                    <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-success">Steady performance</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-3 sm:p-5">
                    <p className="text-xs sm:text-sm text-muted-foreground">Delayed Stops</p>
                    <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold" style={{ color: "#0F6E56" }}>2</p>
                    <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-warning">Flagged for review</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                <Card className="border-border/50">
                  <CardHeader className="pb-2 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg" style={{ color: "#0F6E56" }}>Live Route Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[240px] sm:h-[360px] overflow-hidden rounded-xl border border-[#b8e0d4] bg-[radial-gradient(circle_at_center,_rgba(31,158,117,0.18),_rgba(255,255,255,0.9)_55%)]">
                      <div className="absolute inset-0 opacity-80" style={{ backgroundImage: "linear-gradient(rgba(15,110,86,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,110,86,0.12) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />

                      <div className="absolute left-[18%] top-[26%] h-3 w-3 rounded-full bg-[#0F6E56] shadow-lg shadow-[#0F6E56]/50" />
                      <div className="absolute left-[33%] top-[48%] h-3 w-3 rounded-full bg-[#0F6E56] shadow-lg shadow-[#0F6E56]/50" />
                      <div className="absolute left-[52%] top-[38%] h-3 w-3 rounded-full bg-[#D97706] shadow-lg shadow-[#D97706]/50" />
                      <div className="absolute left-[72%] top-[25%] h-3 w-3 rounded-full bg-[#0F6E56] shadow-lg shadow-[#0F6E56]/50" />
                      <div className="absolute left-[78%] top-[58%] h-3 w-3 rounded-full bg-[#DC2626] shadow-lg shadow-[#DC2626]/50" />

                      <div className="absolute left-[18%] top-[26%] h-[120px] w-[120px] rounded-full border border-dashed border-[#0F6E56]/40" />
                      <div className="absolute left-[35%] top-[42%] h-[140px] w-[140px] rounded-full border border-dashed border-[#0F6E56]/40" />

                      <div className="absolute bottom-4 left-4 rounded-lg border border-[#b8e0d4] bg-white/80 px-3 py-2 text-xs shadow-sm">
                        <p className="font-medium" style={{ color: "#0F6E56" }}>Sector 3</p>
                        <p className="text-muted-foreground">Priority route</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-2 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg" style={{ color: "#0F6E56" }}>Collector Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Mike Johnson", zone: "Sector 3", status: "On route", eta: "08 min" },
                      { name: "Sarah Wilson", zone: "Sector 5", status: "Collecting", eta: "12 min" },
                      { name: "Tom Wilson", zone: "Sector 7", status: "Delayed", eta: "28 min" },
                    ].map((collector) => (
                      <div key={collector.name} className="rounded-lg border border-[#b8e0d4] bg-[#F6FAFA] p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium" style={{ color: "#0F6E56" }}>{collector.name}</p>
                            <p className="text-xs text-muted-foreground">{collector.zone}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={collector.status === "Delayed" ? "border-[#F59E0B]/30 bg-[#FEF3C7] text-[#B45309]" : collector.status === "Collecting" ? "border-[#1D9E75]/30 bg-[#DCFCE7] text-[#15803D]" : "border-[#0F6E56]/20 bg-[#E1F5EE] text-[#0F6E56]"}
                          >
                            {collector.status}
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>ETA</span>
                          <span className="font-medium" style={{ color: "#0F6E56" }}>{collector.eta}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* User Management */}
          {activeTab === "users" && (
            <Card className="border-border/50">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                     
                      User Management
                    </CardTitle>
                    
                  </div>
                  <Button className="gap-2">
                    <User className="h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B7280" }} />
                    <Input 
                      placeholder="Search users..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {["all", "resident", "collector", "admin"].map((role) => (
                      <Button 
                        key={role}
                        variant={roleFilter === role ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRoleFilter(role)}
                        className="capitalize text-xs sm:text-sm shrink-0"
                      >
                        {role === "all" ? "All Users" : role + "s"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Users Table - Desktop */}
                <div className="overflow-x-auto scrollbar-hide hidden sm:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Collections</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Join Date</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-border/50" style={{ transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#E1F5EE"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center" style={{ color: "#0F6E56" }}>
                                <User className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">{[u.first_name, u.last_name].filter(Boolean).join(" ") || u.username}</p>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                                <div className="flex gap-2 mt-1 sm:hidden">
                                  <Badge variant="outline" className={roleConfig[u.role as keyof typeof roleConfig].className}>
                                    {roleConfig[u.role as keyof typeof roleConfig].label}
                                  </Badge>
                                  <Badge variant="outline" className={statusConfig[u.status as keyof typeof statusConfig].className}>
                                    {statusConfig[u.status as keyof typeof statusConfig].label}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <Badge variant="outline" className={roleConfig[u.role as keyof typeof roleConfig].className}>
                              {roleConfig[u.role as keyof typeof roleConfig].label}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <Badge variant="outline" className={statusConfig[u.status as keyof typeof statusConfig].className}>
                              {statusConfig[u.status as keyof typeof statusConfig].label}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">
                            {allPickups.filter(p => p.collector === u.id || p.resident === u.id).length}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">
                            {(() => { try { return format(parseISO(u.date_joined), "yyyy-MM-dd"); } catch { return u.date_joined; } })()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" style={{ color: "#0EA5E9" }} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" style={{ color: "#D97706" }} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Users Cards - Mobile */}
                <div className="space-y-3 sm:hidden">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="rounded-lg border border-[#b8e0d4] bg-[#F6FAFA] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F6E56]/10" style={{ color: "#0F6E56" }}>
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: "#0F6E56" }}>{[u.first_name, u.last_name].filter(Boolean).join(" ") || u.username}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Eye className="h-3.5 w-3.5" style={{ color: "#0EA5E9" }} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Edit className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <Badge variant="outline" className={roleConfig[u.role as keyof typeof roleConfig].className}>
                          {roleConfig[u.role as keyof typeof roleConfig].label}
                        </Badge>
                        <Badge variant="outline" className={statusConfig[u.status as keyof typeof statusConfig].className}>
                          {statusConfig[u.status as keyof typeof statusConfig].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{allPickups.filter(p => p.collector === u.id || p.resident === u.id).length} collections</span>
                        <span className="text-xs text-muted-foreground">Joined {(() => { try { return format(parseISO(u.date_joined), "yyyy-MM-dd"); } catch { return u.date_joined; } })()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Collection Reports */}
          {activeTab === "reports" && (
            <>
              {/* Monthly Reports */}
              <Card className="border-border/50">
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <div>
                      <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                        
                        Monthly Reports
                      </CardTitle>
                      
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" style={{ color: "#2563EB" }} />
                      Export All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Period</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Collections</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Total Weight</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Recycling Rate</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyReports.map((report, idx) => (
                          <tr key={idx} className="border-b border-border/50" style={{ transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#E1F5EE"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center" style={{ color: "#7C3AED" }}>
                                  <Calendar className="h-4 w-4" />
                                </div>
                                <div>
                                  <span className="font-medium">{report.period}</span>
                                  <div className="flex gap-2 mt-1 sm:hidden">
                                    <span className="text-xs text-muted-foreground">{report.totalCollections.toLocaleString()} collections</span>
                                    <Badge className="bg-success/10 text-success border-success/20 text-xs">
                                      Completed
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium hidden sm:table-cell">{report.totalCollections.toLocaleString()}</td>
                            <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{report.totalWeight}</td>
                            <td className="py-3 px-4 hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <Progress value={report.recyclingRate} className="w-20 h-2" />
                                <span className="text-sm text-muted-foreground">{report.recyclingRate}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 hidden sm:table-cell">
                              <Badge className="bg-success/10 text-success border-success/20">
                                <CheckCircle2 className="h-3 w-3 mr-1" style={{ color: "#059669" }} />
                                Completed
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Eye className="h-4 w-4" style={{ color: "#0EA5E9" }} />
                                  View
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="h-4 w-4" style={{ color: "#2563EB" }} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Sector Performance */}
              <Card className="border-border/50">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                    
                    Sector Performance
                  </CardTitle>
                  
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sector</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Collections</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Weight</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Efficiency</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Collectors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sectorReports.map((sector) => (
                          <tr key={sector.sector} className="border-b border-border/50" style={{ transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#E1F5EE"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center" style={{ color: "#E74C3C" }}>
                                  <MapPin className="h-4 w-4" />
                                </div>
                                <div>
                                  <span className="font-medium">{sector.sector}</span>
                                  <div className="flex gap-2 mt-1 sm:hidden">
                                    <span className="text-xs text-muted-foreground">{sector.collections} collections</span>
                                    <span className="text-xs font-medium">{sector.efficiency}% eff.</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium hidden sm:table-cell">{sector.collections}</td>
                            <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{sector.weight}</td>
                            <td className="py-3 px-4 hidden sm:table-cell">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E1F5EE" }}>
                                  <div 
                                    className={`h-full rounded-full ${
                                      sector.efficiency >= 95 ? 'bg-success' : 
                                      sector.efficiency >= 90 ? 'bg-primary' : 'bg-warning'
                                    }`}
                                    style={{ width: `${sector.efficiency}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{sector.efficiency}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4" style={{ color: "#0D9488" }} />
                                <span>{sector.collectors}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        <DashboardDialog
          open={profileOpen}
          onOpenChange={(open) => {
            setProfileOpen(open);
            if (!open) setActiveTab("overview");
          }}
          title="Admin Profile"
        >
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F6E56]">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold" style={{ color: "#0F6E56" }}>
                  {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : displayName}
                </h3>
                <p className="text-sm" style={{ color: "#444441" }}>{user?.email || ""}</p>
                <Badge variant="secondary" className="mt-2 bg-[#E1F5EE] text-[#0F6E56]">Administrator</Badge>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4" style={{ borderColor: "#b8e0d4" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#444441" }}>Phone</span>
                <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>{user?.phone || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#444441" }}>Department</span>
                <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>Operations</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#444441" }}>Access Level</span>
                <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>Full Control</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-2 sm:gap-3">
            <Button variant="outline" className="flex-1" onClick={() => {
              setProfileOpen(false);
              setActiveTab("overview");
            }}>Close</Button>
            <Button
              className="flex-1 bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
              onClick={() => {
                setProfileOpen(false);
                setSettingsOpen(true);
                setActiveTab("settings");
              }}
            >
              Edit Profile
            </Button>
          </DialogFooter>
        </DashboardDialog>

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
                  <span className="text-sm" style={{ color: "#444441" }}>Email alerts</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 accent-[#1D9E75]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm" style={{ color: "#444441" }}>SMS notifications</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 accent-[#1D9E75]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm" style={{ color: "#444441" }}>System reports</span>
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 accent-[#1D9E75]" />
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium" style={{ color: "#0F6E56" }}>Preferences</h4>
              <div className="space-y-2">
                <label className="text-sm" style={{ color: "#444441" }}>Default region</label>
                <Input defaultValue="Nairobi Central" />
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
      </main>
    </div>
  );
};

export default AdminDashboard;