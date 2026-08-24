import { useState } from "react";
import { WelcomeCard } from "@/components/ui/WelcomeCard";
import MobileSidebar from "@/components/ui/MobileSidebar";
import NotificationDrawer from "@/components/ui/NotificationDrawer";
import { useNavigate } from "react-router-dom";
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
  Package, Timer, Phone, Play, Pause, Check, Bell,
  Loader2, AlertCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { useCollectorPickups, useRoutes, useCollectionHistory, useUpdatePickupRequest, useUpdateRoute, useUpdateRouteStop, useNotifications } from "@/hooks/useApi";
import LeafletMap from "@/components/LeafletMap";
import ImageUpload from "@/components/ui/ImageUpload";
import { DashboardFullSkeleton } from "@/components/ui/DashboardSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { PickupRequest, Route as RouteType, CollectionHistory } from "@/lib/types";
import { normalizeList, formatDate, formatTime, formatMonth } from "@/lib/normalize";

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
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { data: pickupsData, isLoading: pickupsLoading, isError: pickupsError, error: pickupsErr } = useCollectorPickups();
  const { data: routesData, isLoading: routesLoading, isError: routesError, error: routesErr } = useRoutes();
  const { data: historyData, isLoading: historyLoading, isError: historyError, error: historyErr } = useCollectionHistory();
  const updatePickupMutation = useUpdatePickupRequest();
  const updateRouteMutation = useUpdateRoute();
  const { data: notifData } = useNotifications();
  const notifUnread = normalizeList<{ is_read: boolean }>(notifData).filter(n => !n.is_read).length;

  const [activeTab, setActiveTab] = useState("overview");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [expandedRoute, setExpandedRoute] = useState<number | null>(null);

  const pickups = normalizeList<PickupRequest>(pickupsData);
  const routes = normalizeList<RouteType>(routesData);
  const history = normalizeList<CollectionHistory>(historyData);

  const isLoading = pickupsLoading || routesLoading || historyLoading;
  const hasError = pickupsError || routesError || historyError;
  const errorMsg = pickupsErr?.message || routesErr?.message || historyErr?.message;



  const getResidentName = (pickup: PickupRequest) => {
    if (pickup.resident_detail) {
      const name = [pickup.resident_detail.first_name, pickup.resident_detail.last_name].filter(Boolean).join(" ");
      return name || pickup.resident_detail.username;
    }
    return `User #${pickup.resident}`;
  };

  const getResidentPhone = (pickup: PickupRequest) => {
    return pickup.resident_detail?.phone || "-";
  };

  const completedPickups = pickups.filter(p => p.status === "completed").length;
  const pendingPickups = pickups.filter(p => p.status === "pending").length;
  const progressPercentage = pickups.length > 0 ? (completedPickups / pickups.length) * 100 : 0;

  const activeRoute = routes.find(r => r.status === "active");
  const isRouteActive = !!activeRoute;

  const totalDistance = routes.reduce((sum, r) => sum + (r.distance_km || 0), 0);

  const stats = [
    { label: "Today's Pickups", value: pickups.length.toString(), icon: Package, color: "text-primary" },
    { label: "Completed", value: completedPickups.toString(), icon: CheckCircle2, color: "text-success" },
    { label: "Pending", value: pendingPickups.toString(), icon: Clock, color: "text-warning" },
    { label: "Total Distance", value: `${totalDistance.toFixed(1)} km`, icon: Navigation, color: "text-secondary" },
  ];

  const handleCompletePickup = (id: number) => {
    updatePickupMutation.mutate(
      { id, data: { status: "completed" } },
      {
        onSuccess: () => toast.success("Pickup marked as completed!"),
        onError: (err: Error) => toast.error(err.message || "Failed to update pickup."),
      },
    );
  };

  const handleStartRoute = () => {
    const upcoming = routes.find(r => r.status === "upcoming");
    if (!upcoming) {
      toast.error("No upcoming routes to start.");
      return;
    }
    updateRouteMutation.mutate(
      { id: upcoming.id, data: { status: "active" } },
      {
        onSuccess: () => toast.success(`Route "${upcoming.name}" started!`),
        onError: (err: Error) => toast.error(err.message || "Failed to start route."),
      },
    );
  };

  const handlePauseRoute = () => {
    if (!activeRoute) return;
    updateRouteMutation.mutate(
      { id: activeRoute.id, data: { status: "upcoming" } },
      {
        onSuccess: () => toast.success(`Route "${activeRoute.name}" paused.`),
        onError: (err: Error) => toast.error(err.message || "Failed to pause route."),
      },
    );
  };

  const updateStopMutation = useUpdateRouteStop();

  const handleRouteCardAction = (route: RouteType) => {
    if (route.status === "active") {
      setExpandedRoute(expandedRoute === route.id ? null : route.id);
    } else {
      updateRouteMutation.mutate(
        { id: route.id, data: { status: "active" } },
        {
          onSuccess: () => toast.success(`Route "${route.name}" started!`),
          onError: (err: Error) => toast.error(err.message || "Failed to start route."),
        },
      );
    }
  };

  const handleCompleteRoute = () => {
    if (!activeRoute) return;
    updateRouteMutation.mutate(
      { id: activeRoute.id, data: { status: "completed" } },
      {
        onSuccess: () => toast.success(`Route "${activeRoute.name}" completed!`),
        onError: (err: Error) => toast.error(err.message || "Failed to complete route."),
      },
    );
  };

  const handleCompleteStop = (stop: import("@/lib/types").RouteStop) => {
    updateStopMutation.mutate(
      { id: stop.id, data: { status: "completed" } },
      {
        onSuccess: () => toast.success(`Stop #${stop.stop_number} completed!`),
        onError: (err: Error) => toast.error(err.message || "Failed to update stop."),
      },
    );
  };

  const handleNavigate = (pickup: PickupRequest) => {
    const addr = encodeURIComponent(pickup.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${addr}`, "_blank");
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
              onTabChange={handleSidebarClick}
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {isRouteActive ? (
              <Button size="sm" variant="destructive" className="gap-2" onClick={handlePauseRoute} disabled={updateRouteMutation.isPending}>
                {updateRouteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pause className="h-4 w-4" />}
                Pause Route
              </Button>
            ) : (
              <Button size="sm" className="gap-2 bg-[#1D9E75] text-white hover:bg-[#0F6E56]" onClick={handleStartRoute} disabled={updateRouteMutation.isPending}>
                {updateRouteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Start Route
              </Button>
            )}
            <button
              className="relative p-2 rounded-full hover:bg-[#E1F5EE] transition-colors"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-5 w-5" style={{ color: "#D97706" }} />
              {notifUnread > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#D97706]" />}
            </button>
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#E1F5EE] transition-colors cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden bg-[#0F6E56]">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block" style={{ color: "#0F6E56" }}>{user?.first_name || user?.username || "Collector"}</span>
            </button>
          </div>
        </header>

        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {isLoading && <DashboardFullSkeleton />}
          {hasError && !isLoading && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex items-center gap-3 py-6">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <div>
                  <p className="font-medium text-red-700">Failed to load data</p>
                  <p className="text-sm text-red-500">{errorMsg || "Please try again later."}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {!isLoading && activeTab === "overview" && (
            <>
              {/* Welcome Card */}
              <WelcomeCard userName={user?.first_name || user?.username || "Collector"} />

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
              {isRouteActive && activeRoute && (
                <Card className="border-success/30 bg-success/5">
                  <CardContent className="p-3 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center animate-pulse shrink-0" style={{ color: "#0F6E56" }}>
                          <Navigation className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm sm:text-base text-success">Route Active</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{activeRoute.name}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg sm:text-2xl font-bold">{completedPickups}/{pickups.length}</p>
                        <p className="text-[11px] sm:text-sm text-muted-foreground">Pickups Done</p>
                      </div>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    {activeRoute.stops && activeRoute.stops.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Route Stops ({activeRoute.stops.filter(s => s.status === "completed").length}/{activeRoute.stops.length})</p>
                        <div className="flex flex-wrap gap-1.5">
                          {activeRoute.stops.map((stop) => (
                            <span
                              key={stop.id}
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                                stop.status === "completed"
                                  ? "bg-[#9FE1CB] text-[#0F6E56] border-[#0F6E56]/20"
                                  : stop.status === "in_progress"
                                    ? "bg-[#FEF3C7] text-[#92400E] border-[#D97706]/20"
                                    : "bg-white text-[#444441] border-[#b8e0d4]"
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                stop.status === "completed" ? "bg-[#0F6E56]" : stop.status === "in_progress" ? "bg-[#D97706]" : "bg-[#b8e0d4]"
                              }`} />
                              #{stop.stop_number}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
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
                            {wasteTypeIcons[pickup.waste_type] || ""}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm sm:text-base" style={{ color: "#0F6E56" }}>{pickup.waste_type}</p>
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
                                <span className="truncate">{getResidentName(pickup)}</span>
                              </span>
                              <span className="flex items-center gap-1" style={{ color: "#444441" }}>
                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                {formatTime(pickup.scheduled_datetime)}
                              </span>
                              <span className="flex items-center gap-1" style={{ color: "#444441" }}>
                                <Package className="h-3.5 w-3.5 shrink-0" />
                                ~{pickup.estimated_weight_kg ? `${pickup.estimated_weight_kg} kg` : "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto sm:shrink-0">
                          <Button size="icon" variant="outline" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => {
                            const phone = getResidentPhone(pickup);
                            if (phone && phone !== "-") window.open(`tel:${phone}`);
                            else toast.error("No phone number available.");
                          }}>
                            <Phone className="h-4 w-4" style={{ color: "#2563EB" }} />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => handleNavigate(pickup)}>
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
          {!isLoading && activeTab === "routes" && (
            <div className="space-y-4">
              {/* Active Route Map */}
              {isRouteActive && activeRoute && (
                <Card className="border-[#b8e0d4] bg-[#F6FAFA]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                          <Navigation className="h-5 w-5" />
                          {activeRoute.name}
                          <Badge className="bg-[#9FE1CB] text-[#0F6E56]">Active</Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {activeRoute.distance_km ? `${activeRoute.distance_km} km` : ""}{activeRoute.distance_km && activeRoute.estimated_duration ? " · " : ""}{activeRoute.estimated_duration || ""}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                        onClick={handleCompleteRoute}
                        disabled={updateRouteMutation.isPending}
                      >
                        {updateRouteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        <span className="hidden sm:inline">Complete Route</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Map */}
                    <LeafletMap
                      markers={[
                        // Route stop locations
                        ...(activeRoute.stops
                          ?.filter((s) => s.location?.lat && s.location?.lng)
                          .map((s) => ({
                            lat: s.location.lat!,
                            lng: s.location.lng!,
                            label: `Stop #${s.stop_number}: ${s.address}`,
                            status: s.status === "completed" ? "completed" as const : s.status === "in_progress" ? "active" as const : s.status === "cancelled" ? "delayed" as const : "pending" as const,
                          })) || []),
                        // Pickup request locations
                        ...pickups
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
                      ]}
                      center={activeRoute.waypoints && activeRoute.waypoints.length > 0 ? [activeRoute.waypoints[0].lat, activeRoute.waypoints[0].lng] : undefined}
                      className="h-[280px] sm:h-[360px]"
                    />

                    {/* Stops List */}
                    {activeRoute.stops && activeRoute.stops.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold" style={{ color: "#0F6E56" }}>
                          Stops ({activeRoute.stops.filter(s => s.status === "completed").length}/{activeRoute.stops.length} completed)
                        </p>
                        <div className="space-y-2">
                          {[...activeRoute.stops].sort((a, b) => a.stop_number - b.stop_number).map((stop) => (
                            <div
                              key={stop.id}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                stop.status === "completed"
                                  ? "bg-[#9FE1CB]/30 border-[#0F6E56]/20"
                                  : stop.status === "in_progress"
                                    ? "bg-[#FEF3C7]/50 border-[#D97706]/30"
                                    : "bg-white border-[#b8e0d4]"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                  stop.status === "completed"
                                    ? "bg-[#0F6E56] text-white"
                                    : stop.status === "in_progress"
                                      ? "bg-[#D97706] text-white"
                                      : "bg-[#b8e0d4] text-[#444441]"
                                }`}>
                                  {stop.status === "completed" ? <Check className="h-4 w-4" /> : stop.stop_number}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate" style={{ color: "#0F6E56" }}>{stop.address}</p>
                                  <div className="flex items-center gap-2 text-xs" style={{ color: "#444441" }}>
                                    {stop.arrival_time && <span>Arrived: {formatTime(stop.arrival_time)}</span>}
                                    {stop.departure_time && <span>· Left: {formatTime(stop.departure_time)}</span>}
                                    {stop.pickup_requests && stop.pickup_requests.length > 0 && (
                                      <span>· {stop.pickup_requests.length} pickup{stop.pickup_requests.length > 1 ? "s" : ""}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {stop.status === "completed" && (
                                  <Badge className="bg-[#9FE1CB] text-[#0F6E56] text-xs">Done</Badge>
                                )}
                                {stop.status !== "completed" && stop.status !== "cancelled" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1 text-xs h-7 border-[#b8e0d4] hover:bg-[#1D9E75] hover:text-white"
                                    onClick={() => handleCompleteStop(stop)}
                                    disabled={updateStopMutation.isPending}
                                  >
                                    <Check className="h-3 w-3" />
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* All Routes List */}
              <Card className="border-[#b8e0d4] bg-[#F6FAFA]">
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                        <Route className="h-5 w-5" />
                        All Routes
                      </CardTitle>
                      <CardDescription className="mt-1">{routes.length} route{routes.length !== 1 ? "s" : ""} assigned</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {routes.map((route) => (
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
                          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center shrink-0 rounded-lg" style={{ backgroundColor: route.status === "active" ? "#0F6E56" : "#b8e0d4" }}>
                            <Route className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: route.status === "active" ? "#ffffff" : "#444441" }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm sm:text-base" style={{ color: "#0F6E56" }}>{route.name}</p>
                              <Badge className={
                                route.status === "active" ? "bg-[#9FE1CB] text-[#0F6E56]" :
                                route.status === "completed" ? "bg-[#E1F5EE] text-[#6B9E8A]" :
                                "bg-white text-[#444441] border border-[#b8e0d4]"
                              }>{route.status === "upcoming" ? "Upcoming" : route.status === "active" ? "Active" : "Completed"}</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm" style={{ color: "#444441" }}>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                {route.stops_count} stops
                              </span>
                              <span className="flex items-center gap-1">
                                <Navigation className="h-3.5 w-3.5 shrink-0" />
                                {route.distance_km ? `${route.distance_km} km` : "-"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Timer className="h-3.5 w-3.5 shrink-0" style={{ color: "#D97706" }} />
                                {route.estimated_duration || "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={route.status === "active" ? "secondary" : "outline"}
                          size="sm"
                          className={`w-full sm:w-auto ${route.status === "active" ? "bg-[#1D9E75] text-white hover:bg-[#0F6E56]" : ""}`}
                          onClick={() => handleRouteCardAction(route)}
                          disabled={updateRouteMutation.isPending}
                        >
                          {route.status === "active" ? (
                            <>{expandedRoute === route.id ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}View Details</>
                          ) : (
                            "Start Route"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {routes.length === 0 && (
                    <p className="text-center py-8" style={{ color: "#444441" }}>No routes assigned.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* COLLECTION HISTORY TAB */}
          {!isLoading && activeTab === "history" && (
            <Card className="border-[#b8e0d4] bg-[#F6FAFA]">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2" style={{ color: "#0F6E56" }}>
                    
                    Collection History
                  </CardTitle>
                  
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  const headers = ["Date", "Route", "Weight", "Duration"];
                  const rows = history.map((r) => [formatDate(r.completed_at), r.route ? `Route #${r.route}` : "-", r.weight_kg ? `${r.weight_kg} kg` : "-", r.duration || "-"]);
                  // Simple CSV export
                  const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `collection-history-${new Date().toISOString().split("T")[0]}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Report exported!");
                }}>Export Report</Button>
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
                      {history.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-[#E1F5EE] transition-colors" style={{ borderColor: "#b8e0d4" }}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" style={{ color: "#7C3AED" }} />
                              <span className="font-medium" style={{ color: "#0F6E56" }}>{formatDate(record.completed_at)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4" style={{ color: "#444441" }}>{record.route ? `Route #${record.route}` : "-"}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="border-[#b8e0d4] bg-[#9FE1CB] text-[#0F6E56]">1 pickup</Badge>
                          </td>
                          <td className="py-3 px-4 font-medium" style={{ color: "#0F6E56" }}>{record.weight_kg ? `${record.weight_kg} kg` : "-"}</td>
                          <td className="py-3 px-4" style={{ color: "#444441" }}>{record.duration || "-"}</td>
                        </tr>
                      ))}
                      {history.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-8" style={{ color: "#444441" }}>No collection history yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

               {/* Mobile Cards */}
                <div className="space-y-3 sm:hidden">
                  {history.map((record) => (
                    <div key={record.id} className="rounded-lg border border-[#b8e0d4] bg-[#F6FAFA] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" style={{ color: "#7C3AED" }} />
                          <span className="font-medium text-sm" style={{ color: "#0F6E56" }}>{formatDate(record.completed_at)}</span>
                        </div>
                        <Badge variant="outline" className="border-[#b8e0d4] bg-[#9FE1CB] text-[#0F6E56] text-xs">1 pickup</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs" style={{ color: "#444441" }}>
                        <span>Route: {record.route ? `#${record.route}` : "-"}</span>
                        <span className="font-medium" style={{ color: "#0F6E56" }}>{record.weight_kg ? `${record.weight_kg} kg` : "-"}</span>
                      </div>
                      <div className="text-xs mt-1" style={{ color: "#444441" }}>Duration: {record.duration || "-"}</div>
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
            toast.success("Settings saved!");
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
        <div className="py-4 space-y-4">
          <div className="flex flex-col items-center gap-4">
            <ImageUpload
              currentImage={user?.profile_picture}
              onUploadSuccess={(url) => updateUser({ profile_picture: url })}
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold" style={{ color: "#0F6E56" }}>
                {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name || user?.username || "Collector"}
              </h3>
              <p className="text-sm" style={{ color: "#444441" }}>{user?.email || ""}</p>
              <Badge variant="secondary" className="mt-2 bg-[#E1F5EE] text-[#0F6E56]">Collector</Badge>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4" style={{ borderColor: "#b8e0d4" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Phone</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>{user?.phone || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Zone</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>{user?.zone || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Member Since</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>
                {user?.date_joined ? formatMonth(user.date_joined) : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Total Collections</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>{history.length}</span>
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