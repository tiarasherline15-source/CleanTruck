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
import { DialogFooter } from "@/components/ui/dialog";import { Users, Truck, FileBarChart, Settings,
  LogOut, User, Package,
  Scale, MapPin, Calendar, Search,
  Edit, Trash2, Eye, Download, ChevronDown,
  BarChart3, Activity, AlertTriangle, CheckCircle2, Clock, UserPlus,
} from "lucide-react";
import { useUsers, usePickupRequests, useRoutes, useCollectionHistory, useNotifications, useUpdatePickupRequest } from "@/hooks/useApi";
import ImageUpload from "@/components/ui/ImageUpload";
import CreateCollectorDialog from "@/components/CreateCollectorDialog";
import ViewUserDialog from "@/components/ViewUserDialog";
import EditUserDialog from "@/components/EditUserDialog";
import DeleteUserDialog from "@/components/DeleteUserDialog";
import AssignPickupContent from "@/components/AssignPickupDialog";
import ExportPreviewDialog, { type ExportPreviewData } from "@/components/ExportPreviewDialog";
import LeafletMap from "@/components/LeafletMap";
import { DashboardFullSkeleton } from "@/components/ui/DashboardSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { User as UserType, PickupRequest, Route, CollectionHistory, Notification } from "@/lib/types";
import { normalizeList, formatDate, formatShortDateTime, formatMonth } from "@/lib/normalize";


const roleConfig = {
  admin: { label: "Admin", className: "bg-destructive/10 text-destructive border-destructive/20" },
  collector: { label: "Collector", className: "bg-secondary/10 text-secondary border-secondary/20" },
  resident: { label: "Resident", className: "bg-primary/10 text-primary border-primary/20" },
};

const statusConfig = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", className: "bg-muted/30 text-muted-foreground border-muted" },
  on_leave: { label: "On Leave", className: "bg-warning/10 text-warning border-warning/20" },
};

const pickupStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  in_progress: { label: "In Progress", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Cancelled", className: "bg-muted/30 text-muted-foreground border-muted" },
};

const pickupPriorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
  normal: { label: "Normal", className: "bg-primary/10 text-primary border-primary/20" },
  low: { label: "Low", className: "bg-muted/30 text-muted-foreground border-muted" },
};

const alertTypeConfig = {
  warning: { icon: AlertTriangle, className: "text-warning bg-warning/10" },
  info: { icon: Activity, className: "text-primary bg-primary/10" },
  success: { icon: CheckCircle2, className: "text-success bg-success/10" },
  error: { icon: AlertTriangle, className: "text-destructive bg-destructive/10" },
};

const AdminDashboard = () => {
  const { user, logout, updateUser } = useAuth();
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
  const [createCollectorOpen, setCreateCollectorOpen] = useState(false);
  const [viewUser, setViewUser] = useState<UserType | null>(null);
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserType | null>(null);
  const [pickupSearch, setPickupSearch] = useState("");
  const [pickupStatusFilter, setPickupStatusFilter] = useState("all");
  const [pickupZoneFilter, setPickupZoneFilter] = useState("all");
  const [viewPickup, setViewPickup] = useState<PickupRequest | null>(null);
  const [assignPickup, setAssignPickup] = useState<PickupRequest | null>(null);
  const [exportPreview, setExportPreview] = useState<ExportPreviewData | null>(null);

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

  const normalizeZone = (z: string) => z.toLowerCase().replace(/[\s_-]+/g, "_");

  const filteredPickups = allPickups.filter(p => {
    const matchesSearch = pickupSearch === "" ||
      p.address.toLowerCase().includes(pickupSearch.toLowerCase()) ||
      (p.zone && p.zone.toLowerCase().includes(pickupSearch.toLowerCase()));
    const matchesStatus = pickupStatusFilter === "all" || p.status === pickupStatusFilter;
    const matchesZone = pickupZoneFilter === "all" || (p.zone && normalizeZone(p.zone) === normalizeZone(pickupZoneFilter));
    return matchesSearch && matchesStatus && matchesZone;
  });

  const pickupZones = [...new Set(allPickups.map(p => p.zone).filter(Boolean))];
  const collectors = allUsers.filter(u => u.role === "collector" && u.status === "active");
  const routes = allRoutes;

  const updatePickupMutation = useUpdatePickupRequest();

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
    const month = formatMonth(h.completed_at);
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

  // Export handlers - prepare data and open preview dialog
  const openExport = (title: string, baseName: string, headers: string[], rows: (string | number | null | undefined)[][]) => {
    setExportPreview({ title, baseName, headers, rows });
  };

  const exportMonthlyReports = () => {
    const headers = ["Period", "Collections", "Total Weight", "Recycling Rate", "Status"];
    const rows = monthlyReports.map((r) => [r.period, r.totalCollections, r.totalWeight, `${r.recyclingRate}%`, "Completed"]);
    openExport("Monthly Reports", "monthly-reports", headers, rows);
  };

  const exportSectorPerformance = () => {
    const headers = ["Sector", "Collections", "Weight", "Efficiency", "Collectors"];
    const rows = sectorReports.map((s) => [s.sector, s.collections, s.weight, `${s.efficiency}%`, s.collectors]);
    openExport("Sector Performance", "sector-performance", headers, rows);
  };

  const exportPickups = () => {
    const headers = ["ID", "Address", "Zone", "Waste Type", "Status", "Priority", "Scheduled", "Resident", "Collector", "Est. Weight (kg)", "Actual Weight (kg)", "Created"];
    const rows = filteredPickups.map((p) => [
      p.id, p.address, p.zone, p.waste_type, p.status, p.priority,
      formatDate(p.scheduled_datetime),
      p.resident_detail ? [p.resident_detail.first_name, p.resident_detail.last_name].filter(Boolean).join(" ") || p.resident_detail.email : `#${p.resident}`,
      p.collector_detail ? [p.collector_detail.first_name, p.collector_detail.last_name].filter(Boolean).join(" ") || p.collector_detail.email : "Unassigned",
      p.estimated_weight_kg, p.actual_weight_kg, formatDate(p.created_at),
    ]);
    openExport("Collection Requests", "pickup-requests", headers, rows);
  };

  const exportUsers = () => {
    const headers = ["ID", "Name", "Email", "Role", "Status", "Phone", "Zone", "Joined"];
    const rows = filteredUsers.map((u) => [
      u.id, [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username,
      u.email, u.role, u.status, u.phone, u.zone, formatDate(u.date_joined),
    ]);
    openExport("Users", "users", headers, rows);
  };

  const stats = [
    { label: "Total Collections", value: totalPickups.toLocaleString(), icon: Package, color: "text-primary" },
    { label: "Total Weight", value: `${(totalWeight / 1000).toFixed(1)} tons`, icon: Scale, color: "text-secondary" },
    { label: "Active Users", value: activeUsers.toLocaleString(), icon: Users, color: "text-accent" },
    { label: "Active Collectors", value: activeCollectors.toString(), icon: Truck, color: "text-success" },
  ];

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "pickups", label: "Collection Requests", icon: Package },
    { id: "route-management", label: "Route Management", icon: MapPin },
    { id: "users", label: "User Management", icon: Users },
    { id: "reports", label: "Collection Reports", icon: FileBarChart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyStats = days.map((day, dayIndex) => ({
    day,
    collections: allPickups.filter((pickup) => {
      try { return new Date(pickup.scheduled_datetime).getDay() === dayIndex; } catch { return false; }
    }).length,
  }));

  const maxCollections = Math.max(...weeklyStats.map(d => d.collections), 1);
  const inProgressPickups = allPickups.filter((pickup) => pickup.status === "in_progress").length;
  const activeRouteCollectorIds = new Set(allRoutes.filter((route) => route.status === "active").map((route) => route.collector));
  const collectorStatuses = allUsers
    .filter((candidate) => candidate.role === "collector")
    .map((collector) => ({
      name: [collector.first_name, collector.last_name].filter(Boolean).join(" ") || collector.username,
      zone: collector.zone || "Unassigned",
      status: activeRouteCollectorIds.has(collector.id) ? "On route" : collector.status === "on_leave" ? "On leave" : "Available",
    }));

  const routeMarkers = [
    // Route waypoints
    ...allRoutes.flatMap((route) => {
      const waypoints = route.waypoints || [];
      const stops = route.stops || [];
      const waypointMarkers = waypoints
        .filter((waypoint) => waypoint && Number.isFinite(waypoint.lat) && Number.isFinite(waypoint.lng))
        .map((waypoint, index) => ({
          lat: waypoint.lat,
          lng: waypoint.lng,
          label: `${route.name} waypoint ${index + 1}`,
          status: route.status === "active" ? "active" as const : route.status === "completed" ? "completed" as const : "pending" as const,
        }));
      const stopMarkers = stops
        .filter((stop) => stop?.location && Number.isFinite(stop.location.lat) && Number.isFinite(stop.location.lng))
        .map((stop) => ({
          lat: stop.location.lat!,
          lng: stop.location.lng!,
          label: `${route.name} stop ${stop.stop_number}: ${stop.address}`,
          status: stop.status === "in_progress" ? "active" as const : stop.status === "completed" ? "completed" as const : stop.status === "cancelled" ? "delayed" as const : "pending" as const,
        }));
      return [...waypointMarkers, ...stopMarkers];
    }),
    // Pickup request locations (from all pickups with coordinates)
    ...allPickups
      .filter((p) => p.location && Number.isFinite(p.location.lat) && Number.isFinite(p.location.lng))
      .map((p) => {
        const statusMap: Record<string, "active" | "completed" | "pending" | "delayed"> = {
          in_progress: "active",
          completed: "completed",
          cancelled: "delayed",
          pending: "pending",
        };
        return {
          lat: p.location.lat!,
          lng: p.location.lng!,
          label: `${p.address || "Pickup #" + p.id} (${p.waste_type})`,
          status: statusMap[p.status] || "pending" as const,
        };
      }),
  ];

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
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 rounded-full hover:bg-[#E1F5EE] transition-colors cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden bg-[#0F6E56]">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: "#0F6E56" }}>Admin</span>
            </button>
          </div>
        </header>

        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {isLoading && <DashboardFullSkeleton />}
          {hasError && !isLoading && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="flex items-center gap-3 py-6">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="font-medium text-destructive">Failed to load data</p>
                  <p className="text-sm text-destructive/70">{errorMsg || "Please try again later."}</p>
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
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <p className="text-base sm:text-xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
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
                      <div key={notif.id} className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg border border-[#b8e0d4] bg-[#F6FAFA]">
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#0F6E56" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium">{notif.message}</p>
                          <p className="text-[11px] sm:text-xs text-muted-foreground">
                            {formatShortDateTime(notif.created_at)}
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
                          fill="none" stroke="#1D9E75" strokeWidth="8"
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
                          fill="none" stroke="#0F6E56" strokeWidth="8"
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
                        <p className="text-base sm:text-xl font-bold text-secondary">{allRoutes.length} routes</p>
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
                        <p className="text-base sm:text-xl font-bold text-primary">{activeCollectors}</p>
                        <Truck className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mt-2 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">Active Collectors</p>
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
                    <p className="mt-1 sm:mt-2 text-base sm:text-xl font-bold text-primary">{activeRoutes}</p>
                    <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-muted-foreground">From live route data</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-3 sm:p-5">
                    <p className="text-xs sm:text-sm text-muted-foreground">Completion Rate</p>
                    <p className="mt-1 sm:mt-2 text-base sm:text-xl font-bold text-primary">{collectionRate}%</p>
                    <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-muted-foreground">From pickup statuses</p>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-3 sm:p-5">
                    <p className="text-xs sm:text-sm text-muted-foreground">In-Progress Pickups</p>
                    <p className="mt-1 sm:mt-2 text-base sm:text-xl font-bold text-primary">{inProgressPickups}</p>
                    <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-muted-foreground">Currently assigned</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                <Card className="border-border/50">
                  <CardHeader className="pb-2 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg" style={{ color: "#0F6E56" }}>Live Route Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LeafletMap markers={routeMarkers} className="h-[240px] sm:h-[360px]" />
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-2 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg" style={{ color: "#0F6E56" }}>Collector Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {collectorStatuses.length === 0 ? (
                      <p className="text-center py-4 text-sm text-muted-foreground">No collectors found.</p>
                    ) : (
                      collectorStatuses.map((collector) => (
                        <div key={collector.name} className="rounded-lg border border-[#b8e0d4] bg-[#F6FAFA] p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-primary">{collector.name}</p>
                              <p className="text-xs text-muted-foreground">{collector.zone}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={collector.status === "On route" ? "border-primary/20 bg-primary/10 text-primary" : collector.status === "On leave" ? "border-warning/20 bg-warning/10 text-warning" : "border-success/20 bg-success/10 text-success"}
                            >
                              {collector.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Collection Requests */}
          {activeTab === "pickups" && (
            <Card className="border-border/50">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                      Collection Requests
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      View, filter, and assign pickup requests across the system
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={exportPickups}>
                    <Download className="h-4 w-4" style={{ color: "#2563EB" }} />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B7280" }} />
                    <Input
                      placeholder="Search by address or zone..."
                      value={pickupSearch}
                      onChange={(e) => setPickupSearch(e.target.value)}
                      className="pl-10 bg-white border-border h-11"
                    />
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {["all", "pending", "in_progress", "completed", "cancelled"].map((s) => (
                      <Button
                        key={s}
                        variant={pickupStatusFilter === s ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPickupStatusFilter(s)}
                        className={`capitalize text-xs sm:text-sm shrink-0 ${pickupStatusFilter !== s ? "bg-white hover:bg-primary/5" : ""}`}
                      >
                        {s === "all" ? "All" : s.replace("_", " ")}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-1">
                    <Button
                      variant={pickupZoneFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPickupZoneFilter("all")}
                      className={`text-xs sm:text-sm shrink-0 ${pickupZoneFilter !== "all" ? "bg-white hover:bg-primary/5" : ""}`}
                    >
                      All Zones
                    </Button>
                    {pickupZones.map((z) => (
                      <Button
                        key={z}
                        variant={pickupZoneFilter === z ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPickupZoneFilter(z)}
                        className={`text-xs sm:text-sm shrink-0 ${pickupZoneFilter !== z ? "bg-white hover:bg-primary/5" : ""}`}
                      >
                        {z.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Pickups Table - Desktop */}
                <div className="overflow-x-auto scrollbar-hide hidden sm:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Request</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Zone</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Waste Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Scheduled</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Collector</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPickups.length === 0 && (
                        <tr><td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No pickup requests found.</td></tr>
                      )}
                      {filteredPickups.map((p) => (
                        <tr key={p.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{p.address || "No address"}</p>
                              <p className="text-xs text-muted-foreground">#{p.id} · {p.resident_detail ? [p.resident_detail.first_name, p.resident_detail.last_name].filter(Boolean).join(" ") || p.resident_detail.email : `Resident #${p.resident}`}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">
                            {p.zone ? <Badge variant="outline" className="text-xs bg-[#E1F5EE] text-[#0F6E56] border-[#b8e0d4]">{p.zone.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</Badge> : <span>-</span>}
                          </td>
                          <td className="py-3 px-4 text-sm hidden md:table-cell">{p.waste_type}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">
                            {formatDate(p.scheduled_datetime)}
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            {p.collector_detail ? (
                              <span className="text-sm font-medium">{[p.collector_detail.first_name, p.collector_detail.last_name].filter(Boolean).join(" ") || p.collector_detail.email}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={pickupStatusConfig[p.status]?.className}>
                              {pickupStatusConfig[p.status]?.label || p.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewPickup(p)}>
                                <Eye className="h-4 w-4" style={{ color: "#0EA5E9" }} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setAssignPickup(p)}>
                                <UserPlus className="h-4 w-4" style={{ color: "#D97706" }} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pickups Cards - Mobile */}
                <div className="space-y-3 sm:hidden">
                  {filteredPickups.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">No pickup requests found.</p>
                  )}
                  {filteredPickups.map((p) => (
                    <div key={p.id} className="rounded-lg border border-[#b8e0d4] bg-[#F6FAFA] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{p.address || "No address"}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">#{p.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={pickupStatusConfig[p.status]?.className}>
                            {pickupStatusConfig[p.status]?.label || p.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className={pickupPriorityConfig[p.priority]?.className}>
                          {pickupPriorityConfig[p.priority]?.label || p.priority}
                        </Badge>
                        {p.zone && <Badge variant="outline" className="text-xs bg-[#E1F5EE] text-[#0F6E56] border-[#b8e0d4]">{p.zone.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</Badge>}
                        <span className="text-xs text-muted-foreground">{p.waste_type}</span>
                      </div>
                      {p.collector_detail ? (
                        <p className="text-xs text-[#0F6E56] font-medium mt-1.5">Assigned to: {[p.collector_detail.first_name, p.collector_detail.last_name].filter(Boolean).join(" ") || p.collector_detail.email}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1.5">Unassigned</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1 h-9 gap-1.5" onClick={() => setViewPickup(p)}>
                          <Eye className="h-3.5 w-3.5" style={{ color: "#0EA5E9" }} />
                          <span className="text-xs">Details</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-9 gap-1.5" onClick={() => setAssignPickup(p)}>
                          <UserPlus className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
                          <span className="text-xs">Assign</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={exportUsers}>
                      <Download className="h-4 w-4" style={{ color: "#2563EB" }} />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                    <Button className="gap-2" onClick={() => setCreateCollectorOpen(true)}>
                      <User className="h-4 w-4" />
                      Add User
                    </Button>
                  </div>
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
                      className="pl-10 bg-white border-border"
                    />
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {["all", "resident", "collector", "admin"].map((role) => (
                      <Button 
                        key={role}
                        variant={roleFilter === role ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRoleFilter(role)}
                        className={`capitalize text-xs sm:text-sm shrink-0 ${roleFilter !== role ? "bg-white hover:bg-primary/5" : ""}`}
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
                        <tr key={u.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center">
                                {u.profile_picture ? (
                                  <img src={u.profile_picture} alt="" className="h-full w-full rounded-full object-cover" />
                                ) : (
                                  <User className="h-4 w-4" style={{ color: "#0F6E56" }} />
                                )}
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
                            {formatDate(u.date_joined)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewUser(u)}>
                                <Eye className="h-4 w-4" style={{ color: "#0EA5E9" }} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditUser(u)}>
                                <Edit className="h-4 w-4" style={{ color: "#D97706" }} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteUser(u)}>
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
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            {u.profile_picture ? (
                              <img src={u.profile_picture} alt="" className="h-full w-full rounded-full object-cover" />
                            ) : (
                              <User className="h-4 w-4" style={{ color: "#0F6E56" }} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{[u.first_name, u.last_name].filter(Boolean).join(" ") || u.username}</p>
                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                          </div>
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
                        <span className="text-xs text-muted-foreground">Joined {formatDate(u.date_joined)}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1 h-9 gap-1.5" onClick={() => setViewUser(u)}>
                          <Eye className="h-3.5 w-3.5" style={{ color: "#0EA5E9" }} />
                          <span className="text-xs">View</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-9 gap-1.5" onClick={() => setEditUser(u)}>
                          <Edit className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
                          <span className="text-xs">Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-9 gap-1.5 text-destructive hover:text-destructive" onClick={() => setDeleteUser(u)}>
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="text-xs">Delete</span>
                        </Button>
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
                    <Button variant="outline" size="sm" className="gap-2" onClick={exportMonthlyReports}>
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
                          <tr key={idx} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
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
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                                  openExport(`Report: ${report.period}`, `report-${report.period.replace(/\s+/g, "-").toLowerCase()}`,
                                    ["Period", "Collections", "Total Weight", "Recycling Rate", "Status"],
                                    [[report.period, report.totalCollections, report.totalWeight, `${report.recyclingRate}%`, "Completed"]]
                                  );
                                }}>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                      Sector Performance
                    </CardTitle>
                    <Button variant="outline" size="sm" className="gap-2" onClick={exportSectorPerformance}>
                      <Download className="h-4 w-4" style={{ color: "#2563EB" }} />
                      Export
                    </Button>
                  </div>
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
                          <tr key={sector.sector} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
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
                                <div className="w-20 h-2 rounded-full overflow-hidden bg-primary/10">
                                  <div 
                                    className={`h-full rounded-full ${
                                      sector.efficiency >= 95 ? 'bg-success' : 
                                      sector.efficiency >= 90 ? 'bg-primary' : 'bg-warning'
                                    }`}
                                    style={{ width: `${Math.min(sector.efficiency, 100)}%` }}
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
          <div className="py-4">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-white pb-4 -mx-2 px-2 -mt-2 pt-2">
              <div className="flex flex-col items-center gap-4">
                <ImageUpload
                  currentImage={user?.profile_picture}
                  onUploadSuccess={(url) => updateUser({ profile_picture: url })}
                />
                <div className="text-center">
                  <h3 className="text-lg font-semibold" style={{ color: "#0F6E56" }}>
                    {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : displayName}
                  </h3>
                  <p className="text-sm" style={{ color: "#444441" }}>{user?.email || ""}</p>
                  <Badge variant="secondary" className="mt-2 bg-[#E1F5EE] text-[#0F6E56]">Administrator</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4" style={{ borderColor: "#b8e0d4" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#444441" }}>Phone</span>
                <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>{user?.phone || "-"}</span>
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
                <Button variant="outline" size="sm" onClick={() => { setSettingsOpen(false); navigate("/change-password"); }}>Change Password</Button>
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

        {/* User Management Dialogs */}
        <CreateCollectorDialog open={createCollectorOpen} onOpenChange={setCreateCollectorOpen} />
        <ViewUserDialog open={viewUser !== null} onOpenChange={(open) => { if (!open) setViewUser(null); }} user={viewUser} />
        <EditUserDialog open={editUser !== null} onOpenChange={(open) => { if (!open) setEditUser(null); }} user={editUser} />
        <DeleteUserDialog open={deleteUser !== null} onOpenChange={(open) => { if (!open) setDeleteUser(null); }} user={deleteUser} />

        {/* View Pickup Detail Dialog */}
        <DashboardDialog open={viewPickup !== null} onOpenChange={(open) => { if (!open) setViewPickup(null); }} title="Pickup Details">
          {viewPickup && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={pickupStatusConfig[viewPickup.status]?.className}>
                  {pickupStatusConfig[viewPickup.status]?.label}
                </Badge>
                <Badge variant="outline" className={pickupPriorityConfig[viewPickup.priority]?.className}>
                  {pickupPriorityConfig[viewPickup.priority]?.label}
                </Badge>
              </div>
              <div className="space-y-3 border-t pt-4" style={{ borderColor: "#b8e0d4" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <span className="text-sm font-medium text-right max-w-[60%]">{viewPickup.address || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Zone</span>
                  <span className="text-sm font-medium">{viewPickup.zone || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Waste Type</span>
                  <span className="text-sm font-medium">{viewPickup.waste_type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Scheduled</span>
                  <span className="text-sm font-medium">{formatDate(viewPickup.scheduled_datetime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resident</span>
                  <span className="text-sm font-medium">
                    {viewPickup.resident_detail ? [viewPickup.resident_detail.first_name, viewPickup.resident_detail.last_name].filter(Boolean).join(" ") || viewPickup.resident_detail.email : `#${viewPickup.resident}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Collector</span>
                  <span className="text-sm font-medium">
                    {viewPickup.collector_detail ? [viewPickup.collector_detail.first_name, viewPickup.collector_detail.last_name].filter(Boolean).join(" ") || viewPickup.collector_detail.email : "Unassigned"}
                  </span>
                </div>
                {viewPickup.route && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Route</span>
                    <span className="text-sm font-medium">#{viewPickup.route}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Est. Weight</span>
                  <span className="text-sm font-medium">{viewPickup.estimated_weight_kg ? `${viewPickup.estimated_weight_kg} kg` : "-"}</span>
                </div>
                {viewPickup.actual_weight_kg && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Actual Weight</span>
                    <span className="text-sm font-medium">{viewPickup.actual_weight_kg} kg</span>
                  </div>
                )}
                {viewPickup.notes && (
                  <div className="border-t pt-3" style={{ borderColor: "#b8e0d4" }}>
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{viewPickup.notes}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => { setViewPickup(null); setAssignPickup(viewPickup); }}>Assign</Button>
                <Button variant="outline" className="flex-1" onClick={() => setViewPickup(null)}>Close</Button>
              </div>
            </div>
          )}
        </DashboardDialog>

        {/* Assign Pickup Dialog */}
        <DashboardDialog open={assignPickup !== null} onOpenChange={(open) => { if (!open) setAssignPickup(null); }} title="Assign Pickup">
          {assignPickup && (
            <AssignPickupContent
              pickup={assignPickup}
              collectors={collectors}
              onAssign={(collectorId) => {
                const updateData: Record<string, unknown> = { collector: collectorId };
                // Auto-change status to in_progress when assigning a collector
                if (collectorId && assignPickup.status === "pending") {
                  updateData.status = "in_progress";
                }
                updatePickupMutation.mutate(
                  { id: assignPickup.id, data: updateData },
                  {
                    onSuccess: () => {
                      toast.success(collectorId ? "Pickup assigned and route auto-created." : "Pickup unassigned.");
                      setAssignPickup(null);
                    },
                    onError: (err: Error) => toast.error(err.message || "Failed to assign pickup."),
                  }
                );
              }}
              onCancel={() => setAssignPickup(null)}
              isPending={updatePickupMutation.isPending}
            />
          )}
        </DashboardDialog>

        {/* Export Preview Dialog */}
        <ExportPreviewDialog
          open={exportPreview !== null}
          onOpenChange={(open) => { if (!open) setExportPreview(null); }}
          data={exportPreview}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;