import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar, Truck, Clock, Plus,
  CheckCircle2, AlertCircle, XCircle, LogOut, User,
  Home, FileText, Settings, Bell, ChevronRight, Send, MapPin
} from "lucide-react";
import { WelcomeCard } from "@/components/ui/WelcomeCard";

// Mock data for demonstration
const mockRequests = [
  { id: 1, date: "2026-01-10", time: "08:00 AM", wasteType: "General Waste", status: "pending", address: "123 Main St" },
  { id: 2, date: "2026-01-08", time: "10:00 AM", wasteType: "Recyclables", status: "completed", address: "123 Main St" },
  { id: 3, date: "2026-01-06", time: "09:00 AM", wasteType: "Organic Waste", status: "in_progress", address: "123 Main St" },
  { id: 4, date: "2026-01-03", time: "11:00 AM", wasteType: "General Waste", status: "completed", address: "456 Oak Ave" },
  { id: 5, date: "2026-01-01", time: "07:30 AM", wasteType: "E-Waste", status: "completed", address: "123 Main St" },
  { id: 6, date: "2025-12-28", time: "02:00 PM", wasteType: "Recyclables", status: "pending", address: "789 Pine Rd" },
  { id: 7, date: "2025-12-25", time: "09:00 AM", wasteType: "Organic Waste", status: "in_progress", address: "123 Main St" },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
  in_progress: { label: "In Progress", icon: Truck, variant: "warning" as const, className: "bg-[#1D9E75] text-white" },
  completed: { label: "Completed", icon: CheckCircle2, variant: "success" as const, className: "bg-[#9FE1CB] text-[#0F6E56]" },
  cancelled: { label: "Cancelled", icon: XCircle, variant: "destructive" as const },
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const stats = [
    { label: "Total Requests", value: "12", icon: FileText, color: "text-primary" },
    { label: "Pending", value: "2", icon: Clock, color: "text-warning" },
    { label: "Completed", value: "9", icon: CheckCircle2, color: "text-success" },
    { label: "This Month", value: "4", icon: Calendar, color: "text-secondary" },
  ];

  const completedRequests = mockRequests.filter((r) => r.status === "completed");
  const pendingRequests = mockRequests.filter((r) => r.status === "pending");
  const inProgressRequests = mockRequests.filter((r) => r.status === "in_progress");

  const nextPickup = [...mockRequests]
    .filter((r) => r.status === "pending")
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const handleSidebarClick = (tab: string) => {
    if (tab === "schedule") {
      setScheduleOpen(true);
    } else if (tab === "settings") {
      setSettingsOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

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
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[#1D9E75]/20"
            style={{ color: "#9FE1CB" }}
          >
            <Calendar className="h-4 w-4" />
            Schedule Pickup
          </button>
          <button
            onClick={() => handleSidebarClick("settings")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[#1D9E75]/20"
            style={{ color: "#9FE1CB" }}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-6" style={{ backgroundColor: "#F6FAFA", borderBottomColor: "#b8e0d4" }}>
          <div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-2 bg-[#1D9E75] text-white hover:bg-[#0F6E56]" onClick={() => setScheduleOpen(true)}>
              <Plus className="h-4 w-4" />
              New Request
            </Button>
            <button className="relative p-2 rounded-full hover:bg-[#E1F5EE] transition-colors">
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
              <span className="text-sm font-medium hidden sm:block" style={{ color: "#0F6E56" }}>John Doe</span>
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === "overview" && (
            <>
              <WelcomeCard userName="John">
                <div className="rounded-xl px-3 py-2" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "#9FE1CB" }}>Next Pickup</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {nextPickup ? `${nextPickup.date} · ${nextPickup.time}` : "No pending pickups"}
                  </p>
                </div>
              </WelcomeCard>

              {/* Recent Activity */}
              <Card className="border-[#b8e0d4] bg-[#F6FAFA]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle style={{ color: "#0F6E56" }}>Recent Activity</CardTitle>
                    <CardDescription style={{ color: "#444441" }}>Your latest updates</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setViewAllOpen(true)}>
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRequests.slice(0, 3).map((request) => {
                      const status = statusConfig[request.status as keyof typeof statusConfig];
                      return (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-[#b8e0d4] bg-[#F6FAFA] hover:bg-[#E1F5EE] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E1F5EE]" style={{ color: "#0D9488" }}>
                              <Truck className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium" style={{ color: "#0F6E56" }}>{request.wasteType}</p>
                              <p className="text-sm" style={{ color: "#444441" }}>
                                {request.date} at {request.time}
                              </p>
                            </div>
                          </div>
                          <Badge variant={status.variant === "warning" ? "secondary" : status.variant === "success" ? "default" : status.variant} className={(status as { className?: string }).className}>
                            <status.icon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* ===== MY REQUESTS TAB ===== */}
          {activeTab === "requests" && (
            <>
              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="border-[#b8e0d4] bg-[#F6FAFA]">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1F5EE]">
                        <stat.icon className="h-6 w-6" style={{ color: "#4F46E5" }} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold" style={{ color: "#0F6E56" }}>{stat.value}</p>
                        <p className="text-sm" style={{ color: "#444441" }}>{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Completed Requests */}
              <Card className="border-[#b8e0d4] bg-[#F6FAFA]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle style={{ color: "#0F6E56" }}>Completed Requests</CardTitle>
                    <CardDescription style={{ color: "#444441" }}>All your completed waste collections</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setViewAllOpen(true)}>
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-[#F6FAFA] hover:bg-[#E1F5EE] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E1F5EE]" style={{ color: "#059669" }}>
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: "#0F6E56" }}>{request.wasteType}</p>
                            <p className="text-sm" style={{ color: "#444441" }}>
                              {request.date} at {request.time} · {request.address}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-[#9FE1CB] text-[#0F6E56]">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
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

      {/* ===== SCHEDULE PICKUP DIALOG ===== */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ color: "#0F6E56" }}>Schedule a Pickup</DialogTitle>
            <DialogDescription>
              Fill in the details below to schedule a new waste collection request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="waste-type">Waste Type</Label>
              <select
                id="waste-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select waste type...</option>
                <option value="general">General Waste</option>
                <option value="recyclables">Recyclables</option>
                <option value="organic">Organic Waste</option>
                <option value="ewaste">E-Waste</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickup-date">Preferred Date</Label>
                <Input id="pickup-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickup-time">Preferred Time</Label>
                <Input id="pickup-time" type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Pickup Address</Label>
              <Input id="address" placeholder="Enter your address..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Any special instructions for the collector..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button className="bg-[#1D9E75] text-white hover:bg-[#0F6E56] gap-2" onClick={() => setScheduleOpen(false)}>
              <Send className="h-4 w-4" style={{ color: "#0D9488" }} />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== VIEW ALL REQUESTS DIALOG ===== */}
      <Dialog open={viewAllOpen} onOpenChange={setViewAllOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle style={{ color: "#0F6E56" }}>All My Requests</DialogTitle>
            <DialogDescription>
              View and manage all your waste collection requests.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="all" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-4" style={{ backgroundColor: "#E1F5EE" }}>
              <TabsTrigger value="all" className="data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white">
                All ({mockRequests.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white">
                Completed ({completedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white">
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="data-[state=active]:bg-[#1D9E75] data-[state=active]:text-white">
                In Progress ({inProgressRequests.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4 pr-1" style={{ maxHeight: "400px" }}>
              <TabsContent value="all" className="mt-0">
                <RequestsList requests={mockRequests} />
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
        </DialogContent>
      </Dialog>

      {/* ===== SETTINGS DIALOG ===== */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ color: "#0F6E56" }}>Settings</DialogTitle>
            <DialogDescription>
              Manage your account preferences and notification settings.
            </DialogDescription>
          </DialogHeader>
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
                  <span className="text-sm" style={{ color: "#444441" }}>Collection reminders</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 accent-[#1D9E75]" />
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium" style={{ color: "#0F6E56" }}>Preferences</h4>
              <div className="space-y-2">
                <Label htmlFor="default-address">Default Pickup Address</Label>
                <Input id="default-address" placeholder="Enter your default address..." defaultValue="123 Main St, Nairobi" />
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button className="bg-[#1D9E75] text-white hover:bg-[#0F6E56]" onClick={() => setSettingsOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== USER PROFILE DIALOG ===== */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle style={{ color: "#0F6E56" }}>User Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F6E56]">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold" style={{ color: "#0F6E56" }}>John Doe</h3>
                <p className="text-sm" style={{ color: "#444441" }}>john.doe@example.com</p>
                <Badge variant="secondary" className="mt-2 bg-[#E1F5EE] text-[#0F6E56]">Resident</Badge>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4" style={{ borderColor: "#b8e0d4" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#444441" }}>Phone</span>
                <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>+254 700 123 456</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#444441" }}>Address</span>
                <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>123 Main St, Nairobi</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#444441" }}>Member Since</span>
                <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>January 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "#444441" }}>Total Requests</span>
                <span className="text-sm font-medium" style={{ color: "#0F6E56" }}>12</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileOpen(false)}>Close</Button>
            <Button className="bg-[#1D9E75] text-white hover:bg-[#0F6E56]" onClick={() => { setProfileOpen(false); setSettingsOpen(true); }}>
              Edit Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const RequestsList = ({ requests }: { requests: typeof mockRequests }) => {
  if (requests.length === 0) {
    return (
      <p className="text-center py-8" style={{ color: "#444441" }}>No requests in this category.</p>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const status = statusConfig[request.status as keyof typeof statusConfig];
        return (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 rounded-lg border hover:bg-[#E1F5EE] transition-colors"
            style={{ borderColor: "#b8e0d4" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E1F5EE]" style={{ color: "#1D9E75" }}>
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: "#0F6E56" }}>{request.wasteType}</p>
                <p className="text-xs" style={{ color: "#444441" }}>
                  {request.date} at {request.time}
                </p>
                <p className="text-xs flex items-center gap-1" style={{ color: "#444441" }}>
                  <MapPin className="h-3 w-3" style={{ color: "#E74C3C" }} /> {request.address}
                </p>
              </div>
            </div>
            <Badge variant={status.variant === "warning" ? "secondary" : status.variant === "success" ? "default" : status.variant} className={(status as { className?: string }).className}>
              <status.icon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;