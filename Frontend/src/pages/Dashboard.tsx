import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileSidebar from "@/components/ui/MobileSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogFooter } from "@/components/ui/dialog";
import DashboardDialog from "@/components/ui/DashboardDialog";
import {
  Calendar, Truck, Clock, Plus,
  CheckCircle2, AlertCircle, XCircle, LogOut, User,
  Home, FileText, Settings, Bell, ChevronRight, Send, MapPin, Tag, MapPinned, StickyNote, Trash2,
  Loader2
} from "lucide-react";
import { WelcomeCard } from "@/components/ui/WelcomeCard";
import ImageUpload from "@/components/ui/ImageUpload";
import NotificationDrawer from "@/components/ui/NotificationDrawer";
import { DashboardFullSkeleton } from "@/components/ui/DashboardSkeleton";
import { useMyPickupRequests, useCreatePickupRequest, useNotifications } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { PickupRequest } from "@/lib/types";
import { normalizeList, formatDate, formatTime } from "@/lib/normalize";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
  in_progress: { label: "In Progress", icon: Truck, variant: "warning" as const, className: "bg-[#1D9E75] text-white" },
  completed: { label: "Completed", icon: CheckCircle2, variant: "success" as const, className: "bg-[#9FE1CB] text-[#0F6E56]" },
  cancelled: { label: "Cancelled", icon: XCircle, variant: "destructive" as const },
};

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { data: pickupData, isLoading, isError, error } = useMyPickupRequests();
  const createPickup = useCreatePickupRequest();
  const { data: notifData } = useNotifications();
  const notifUnread = normalizeList<{ is_read: boolean }>(notifData).filter(n => !n.is_read).length;

  const [activeTab, setActiveTab] = useState("overview");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Schedule Pickup form state
  const [scheduleForm, setScheduleForm] = useState({
    waste_type: "",
    date: "",
    time: "",
    address: "",
    notes: "",
  });

  const handleScheduleChange = (field: string, value: string) => {
    setScheduleForm(prev => ({ ...prev, [field]: value }));
  };

  const requests = normalizeList<PickupRequest>(pickupData);

  const completedRequests = requests.filter((r) => r.status === "completed");
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const inProgressRequests = requests.filter((r) => r.status === "in_progress");

  const nextPickup = [...pendingRequests]
    .sort((a, b) => a.scheduled_datetime.localeCompare(b.scheduled_datetime))[0];

  const stats = [
    { label: "Total Requests", value: requests.length.toString(), icon: FileText, color: "text-primary" },
    { label: "Pending", value: pendingRequests.length.toString(), icon: Clock, color: "text-warning" },
    { label: "Completed", value: completedRequests.length.toString(), icon: CheckCircle2, color: "text-success" },
    { label: "In Progress", value: inProgressRequests.length.toString(), icon: Calendar, color: "text-secondary" },
  ];

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "requests", label: "My Requests", icon: Truck },
    { id: "schedule", label: "Schedule Pickup", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSidebarClick = (tab: string) => {
    setActiveTab(tab);

    if (tab === "schedule") {
      setScheduleOpen(true);
    } else if (tab === "settings") {
      setSettingsOpen(true);
    }
  };

  const handleDialogClose = (setter: (value: boolean) => void) => {
    setter(false);
    setActiveTab("overview");
  };

  const displayName = user?.first_name || user?.username || "User";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E1F5EE", color: "#444441" }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r hidden lg:block" style={{ backgroundColor: "#0F6E56", borderColor: "#b8e0d4" }}>
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <img src="/favicon-32x32.png" alt="CleanTruck favicon" className="h-8 w-8 rounded-md" />
          <span className="text-lg font-bold text-white">CleanTruck</span>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleSidebarClick("overview")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? ""
                : "hover:bg-[#1D9E75]/20"
            }`}
            style={activeTab === "overview" ? { backgroundColor: "#1D9E75", color: "white" } : { color: "#9FE1CB" }}
          >
            <Home className="h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => handleSidebarClick("requests")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "requests"
                ? ""
                : "hover:bg-[#1D9E75]/20"
            }`}
            style={activeTab === "requests" ? { backgroundColor: "#1D9E75", color: "white" } : { color: "#9FE1CB" }}
          >
            <Truck className="h-4 w-4" />
            My Requests
          </button>
          <button
            onClick={() => handleSidebarClick("schedule")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "schedule" ? "" : "hover:bg-[#1D9E75]/20"
            }`}
            style={activeTab === "schedule" ? { backgroundColor: "#1D9E75", color: "white" } : { color: "#9FE1CB" }}
          >
            <Calendar className="h-4 w-4" />
            Schedule Pickup
          </button>
          <button
            onClick={() => handleSidebarClick("settings")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "settings" ? "" : "hover:bg-[#1D9E75]/20"
            }`}
            style={activeTab === "settings" ? { backgroundColor: "#1D9E75", color: "white" } : { color: "#9FE1CB" }}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
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
            <Button
              size="sm"
              className="gap-2 bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
              onClick={() => {
                setActiveTab("schedule");
                setScheduleOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Request</span>
            </Button>
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
              <span className="text-sm font-medium hidden sm:block" style={{ color: "#0F6E56" }}>{displayName}</span>
            </button>
          </div>
        </header>

        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {isLoading && <DashboardFullSkeleton />}
          {isError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex items-center gap-3 py-6">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <div>
                  <p className="font-medium text-red-700">Failed to load requests</p>
                  <p className="text-sm text-red-500">{error?.message || "Please try again later."}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {!isLoading && activeTab === "overview" && (
            <>
              <WelcomeCard userName={displayName}>
                <div className="rounded-xl px-3 py-2" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "#9FE1CB" }}>Next Pickup</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {nextPickup
                      ? `${formatDate(nextPickup.scheduled_datetime)} · ${formatTime(nextPickup.scheduled_datetime)}`
                      : "No pending pickups"}
                  </p>
                </div>
              </WelcomeCard>

              {/* Recent Activity */}
              <Card className="border-[#b8e0d4] bg-[#F6FAFA]">
                <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-6">
                  <div>
                    <CardTitle className="text-base sm:text-lg" style={{ color: "#0F6E56" }}>Recent Activity</CardTitle>
                    
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setViewAllOpen(true)}>
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {requests.slice(0, 3).map((request) => {
                      const status = statusConfig[request.status as keyof typeof statusConfig];
                      return (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-[#b8e0d4] bg-[#F6FAFA] hover:bg-[#E1F5EE] transition-colors"
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center shrink-0" style={{ color: "#0D9488" }}>
                              <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-sm sm:text-base" style={{ color: "#0F6E56" }}>{request.waste_type}</p>
                              <p className="text-xs sm:text-sm" style={{ color: "#444441" }}>
                                {formatDate(request.scheduled_datetime)} at {formatTime(request.scheduled_datetime)}
                              </p>
                            </div>
                          </div>
                          <Badge variant={status.variant === "warning" ? "secondary" : status.variant === "success" ? "default" : status.variant} className={`${(status as { className?: string }).className} text-[10px] sm:text-xs whitespace-nowrap shrink-0`}>
                            <status.icon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                      );
                    })}
                    {requests.length === 0 && (
                      <p className="text-center py-8" style={{ color: "#444441" }}>No requests yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* MY REQUESTS TAB */}
          {!isLoading && activeTab === "requests" && (
            <>
              {/* Stats Grid */}
              <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="border-[#b8e0d4] bg-[#F6FAFA]">
                    <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-6">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center shrink-0" style={{ color: "#4F46E5" }}>
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

              {/* Completed Requests */}
              <Card className="border-[#b8e0d4] bg-[#F6FAFA]">
                <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-6">
                  <div>
                    <CardTitle className="text-base sm:text-lg" style={{ color: "#0F6E56" }}>Completed Requests</CardTitle>
                    
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setViewAllOpen(true)}>
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {completedRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-[#b8e0d4] bg-[#F6FAFA] hover:bg-[#E1F5EE] transition-colors"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center shrink-0" style={{ color: "#059669" }}>
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base" style={{ color: "#0F6E56" }}>{request.waste_type}</p>
                            <p className="text-xs sm:text-sm" style={{ color: "#444441" }}>
                              {formatDate(request.scheduled_datetime)} at {formatTime(request.scheduled_datetime)} · <span className="hidden sm:inline">{request.address}</span>
                            </p>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-[#9FE1CB] text-[#0F6E56] text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Completed</span>
                          <span className="sm:hidden">Done</span>
                        </Badge>
                      </div>
                    ))}
                    {completedRequests.length === 0 && (
                      <p className="text-center py-8" style={{ color: "#444441" }}>No completed requests yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <NotificationDrawer open={notificationsOpen} onOpenChange={setNotificationsOpen} />

      {/* SCHEDULE PICKUP DIALOG  */}
      <DashboardDialog
        open={scheduleOpen}
        onOpenChange={(open) => {
          setScheduleOpen(open);
          if (!open) setActiveTab("overview");
        }}
        title="Schedule a Pickup"
      >
        <div className="space-y-5 py-2 sm:py-4">
          <div className="space-y-2">
            <Label htmlFor="waste-type" className="text-[#444441]">Waste Type</Label>
            <div className="relative">
              <Trash2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B9E8A" }} />
              <Select value={scheduleForm.waste_type} onValueChange={(v) => handleScheduleChange("waste_type", v)}>
                <SelectTrigger id="waste-type" className="pl-10 h-11 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]">
                  <SelectValue placeholder="Select waste type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Waste">General Waste</SelectItem>
                  <SelectItem value="Recyclables">Recyclables</SelectItem>
                  <SelectItem value="Organic Waste">Organic Waste</SelectItem>
                  <SelectItem value="E-Waste">E-Waste</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[#444441]">Preferred Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 z-10" style={{ color: "#6B9E8A" }} />
                <Select value={scheduleForm.date} onValueChange={(v) => handleScheduleChange("date", v)}>
                  <SelectTrigger className="pl-10 h-11 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75] text-xs sm:text-sm">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const dates: { label: string; value: string }[] = [];
                      for (let i = 0; i < 14; i++) {
                        const d = new Date();
                        d.setDate(d.getDate() + i);
                        const iso = d.toISOString().split("T")[0];
                        const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                        dates.push({ label, value: iso });
                      }
                      return dates.map((d) => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#444441]">Preferred Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 z-10" style={{ color: "#6B9E8A" }} />
                <Select value={scheduleForm.time} onValueChange={(v) => handleScheduleChange("time", v)}>
                  <SelectTrigger className="pl-10 h-11 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75] text-xs sm:text-sm">
                    <SelectValue placeholder="Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"].map((t) => {
                      const [h] = t.split(":");
                      const hour = parseInt(h);
                      const display = hour <= 12 ? `${hour === 0 ? 12 : hour}:00 ${hour < 12 ? "AM" : "PM"}` : `${hour - 12}:00 PM`;
                      return (
                        <SelectItem key={t} value={t}>{display}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup-address" className="text-[#444441]">Pickup Address</Label>
            <div className="relative">
              <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#6B9E8A" }} />
              <Input id="pickup-address" placeholder="Enter your address..." value={scheduleForm.address} onChange={(e) => handleScheduleChange("address", e.target.value)} className="pl-10 h-11 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#444441]">Additional Notes</Label>
            <Textarea id="notes" placeholder="Any special instructions for the collector..." rows={3} value={scheduleForm.notes} onChange={(e) => handleScheduleChange("notes", e.target.value)} className="border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75] min-h-[80px]" />
          </div>
        </div>

        <div className="flex flex-row gap-2 sm:gap-3 pt-2">
          <Button variant="outline" className="flex-1 h-11" onClick={() => handleDialogClose(setScheduleOpen)}>Cancel</Button>
          <Button
            className="flex-1 h-11 bg-[#1D9E75] text-white hover:bg-[#0F6E56] gap-2"
            disabled={createPickup.isPending}
            onClick={() => {
              if (!scheduleForm.waste_type || !scheduleForm.date || !scheduleForm.time || !scheduleForm.address) {
                toast.error("Please fill in all required fields.");
                return;
              }
              const scheduled_datetime = `${scheduleForm.date}T${scheduleForm.time}:00Z`;
              createPickup.mutate(
                {
                  waste_type: scheduleForm.waste_type as PickupRequest["waste_type"],
                  scheduled_datetime,
                  address: scheduleForm.address,
                  notes: scheduleForm.notes,
                  status: "pending",
                  priority: "normal",
                },
                {
                  onSuccess: () => {
                    toast.success("Pickup request submitted!");
                    setScheduleForm({ waste_type: "", date: "", time: "", address: "", notes: "" });
                    handleDialogClose(setScheduleOpen);
                  },
                  onError: (err: Error) => {
                    toast.error(err.message || "Failed to submit request. Please try again.");
                  },
                }
              );
            }}
          >
            {createPickup.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" style={{ color: "#0D9488" }} />
            )}
            {createPickup.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </DashboardDialog>

      {/*  VIEW ALL REQUESTS DIALOG  */}
      <DashboardDialog
        open={viewAllOpen}
        onOpenChange={(open) => {
          setViewAllOpen(open);
          if (!open) setActiveTab("overview");
        }}
        title="All My Requests"
        className="sm:max-w-[600px]"
      >
        <Tabs defaultValue="all" className="flex flex-col gap-3 mt-2 px-2">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1" style={{ backgroundColor: "#E1F5EE" }}>
            <TabsTrigger value="all" className="text-xs sm:text-sm py-2 data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white">
              All ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm py-2 data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white">
              Done ({completedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm py-2 data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="text-xs sm:text-sm py-2 data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white">
              Active ({inProgressRequests.length})
            </TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto scrollbar-hide pr-1" style={{ maxHeight: "300px" }}>
            <TabsContent value="all" className="mt-0">
              <RequestsList requests={requests} />
            </TabsContent>
            <TabsContent value="completed" className="mt-0">
              <RequestsList requests={completedRequests} />
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <RequestsList requests={pendingRequests} />
            </TabsContent>
            <TabsContent value="in_progress" className="mt-0">
              <RequestsList requests={inProgressRequests} />
            </TabsContent>
          </div>
        </Tabs>
      </DashboardDialog>

      {/* SETTINGS DIALOG */}
      <DashboardDialog
        open={settingsOpen}
        onOpenChange={(open) => {
          setSettingsOpen(open);
          if (!open) setActiveTab("overview");
        }}
        title="Settings"
      >
        <div className="space-y-6 py-4 px-2">
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
                <span className="text-sm" style={{ color: "#444441" }}>Collection reminders</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 accent-[#1D9E75]" />
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium" style={{ color: "#0F6E56" }}>Preferences</h4>
            <div className="space-y-2">
              <Label htmlFor="default-address">Default Pickup Address</Label>
              <Input id="default-address" placeholder="Enter your default address..." defaultValue={user?.address || ""} />
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
        <DialogFooter className="flex flex-row gap-2 sm:gap-3 px-2">
          <Button variant="outline" className="flex-1" onClick={() => handleDialogClose(setSettingsOpen)}>Cancel</Button>
          <Button className="flex-1 bg-[#1D9E75] text-white hover:bg-[#0F6E56]" onClick={() => handleDialogClose(setSettingsOpen)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DashboardDialog>

      {/* USER PROFILE DIALOG  */}
      <DashboardDialog
        open={profileOpen}
        onOpenChange={(open) => {
          setProfileOpen(open);
          if (!open) setActiveTab("overview");
        }}
        title="User Profile"
      >
        <div className="py-4 px-2">
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
                <Badge variant="secondary" className="mt-2 bg-[#E1F5EE] text-[#0F6E56]">Resident</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4" style={{ borderColor: "#b8e0d4" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Phone</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>{user?.phone || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Address</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>{user?.address || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Member Since</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>
                {user?.date_joined ? (() => { try { return format(parseISO(user.date_joined), "MMMM yyyy"); } catch { return user.date_joined; } })() : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: "#444441" }}>Total Requests</span>
              <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>{requests.length}</span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-2 sm:gap-3 px-2">
          <Button variant="outline" className="flex-1" onClick={() => handleDialogClose(setProfileOpen)}>Close</Button>
          <Button
            className="flex-1 bg-[#1D9E75] text-white hover:bg-[#0F6E56]"
            onClick={() => {
              setProfileOpen(false);
              setActiveTab("settings");
              setSettingsOpen(true);
            }}
          >
            Edit Profile
          </Button>
        </DialogFooter>
      </DashboardDialog>
    </div>
  );
};

const RequestsList = ({ requests }: { requests: PickupRequest[] }) => {

  if (requests.length === 0) {
    return (
      <p className="text-center py-8" style={{ color: "#444441" }}>No requests in this category.</p>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {requests.map((request) => {
        const status = statusConfig[request.status as keyof typeof statusConfig];
        return (
          <div
            key={request.id}
            className="p-3 sm:p-4 rounded-lg border hover:bg-[#E1F5EE] transition-colors space-y-2"
            style={{ borderColor: "#b8e0d4" }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center shrink-0" style={{ color: "#1D9E75" }}>
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm" style={{ color: "#0F6E56" }}>{request.waste_type}</p>
                  <p className="text-xs" style={{ color: "#444441" }}>
                    {formatDate(request.scheduled_datetime)} at {formatTime(request.scheduled_datetime)}
                  </p>
                </div>
              </div>
              <Badge variant={status.variant === "warning" ? "secondary" : status.variant === "success" ? "default" : status.variant} className={`${(status as { className?: string }).className} text-[10px] sm:text-xs whitespace-nowrap shrink-0`}>
                <status.icon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-1 pl-10 sm:pl-13">
              <MapPin className="h-3 w-3 shrink-0" style={{ color: "#E74C3C" }} />
              <span className="text-xs truncate" style={{ color: "#444441" }}>{request.address}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;