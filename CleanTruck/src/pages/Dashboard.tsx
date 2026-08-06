import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Recycle, Calendar, Truck, Clock, Plus, 
  CheckCircle2, AlertCircle, XCircle, LogOut, User,
  Home, FileText, Settings
} from "lucide-react";

// Mock data for demonstration
const mockRequests = [
  { id: 1, date: "2026-01-10", time: "08:00 AM", wasteType: "General Waste", status: "pending" },
  { id: 2, date: "2026-01-08", time: "10:00 AM", wasteType: "Recyclables", status: "completed" },
  { id: 3, date: "2026-01-06", time: "09:00 AM", wasteType: "Organic Waste", status: "in_progress" },
  { id: 4, date: "2026-01-03", time: "11:00 AM", wasteType: "General Waste", status: "completed" },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const },
  in_progress: { label: "In Progress", icon: Truck, variant: "warning" as const, className: "bg-[#1D9E75] text-white" },
  completed: { label: "Completed", icon: CheckCircle2, variant: "success" as const, className: "bg-[#9FE1CB] text-[#0F6E56]" },
  cancelled: { label: "Cancelled", icon: XCircle, variant: "destructive" as const },
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const stats = [
    { label: "Total Requests", value: "12", icon: FileText, color: "text-primary" },
    { label: "Pending", value: "2", icon: Clock, color: "text-warning" },
    { label: "Completed", value: "9", icon: CheckCircle2, color: "text-success" },
    { label: "This Month", value: "4", icon: Calendar, color: "text-secondary" },
  ];

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
            onClick={() => setActiveTab("overview")}
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
            onClick={() => setActiveTab("requests")}
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
            onClick={() => setActiveTab("schedule")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "schedule"
                ? ""
                : "hover:bg-[#1D9E75]/20"
            }`}
            style={activeTab === "schedule" ? { backgroundColor: "#1D9E75", color: "white" } : { color: "#9FE1CB" }}
          >
            <Calendar className="h-4 w-4" />
            Schedule Pickup
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "settings"
                ? ""
                : "hover:bg-[#1D9E75]/20"
            }`}
            style={activeTab === "settings" ? { backgroundColor: "#1D9E75", color: "white" } : { color: "#9FE1CB" }}
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
            <h1 className="text-xl font-semibold" style={{ color: "#0F6E56" }}>Welcome, John</h1>
            <p className="text-sm" style={{ color: "#444441" }}>Here's your waste collection overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-2 bg-[#1D9E75] text-white hover:bg-[#0F6E56]">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-[#b8e0d4] bg-[#F6FAFA]">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1F5EE]">
                    <stat.icon className="h-6 w-6" style={{ color: "#1D9E75" }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: "#0F6E56" }}>{stat.value}</p>
                    <p className="text-sm" style={{ color: "#444441" }}>{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Requests */}
          <Card className="border-[#b8e0d4] bg-[#F6FAFA]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle style={{ color: "#0F6E56" }}>Recent Requests</CardTitle>
                <CardDescription style={{ color: "#444441" }}>Your latest waste collection requests</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRequests.map((request) => {
                  const status = statusConfig[request.status as keyof typeof statusConfig];
                  return (
                    <div 
                      key={request.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-[#F6FAFA] hover:bg-[#E1F5EE] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E1F5EE]" style={{ color: "#1D9E75" }}>
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

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-[#b8e0d4] bg-[#F6FAFA] hover:border-[#1D9E75]/30 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D9E75] text-white group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "#0F6E56" }}>Schedule New Pickup</p>
                  <p className="text-sm" style={{ color: "#444441" }}>Request waste collection</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#b8e0d4] bg-[#F6FAFA] hover:border-[#1D9E75]/30 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1F5EE] text-[#1D9E75] group-hover:scale-110 transition-transform">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "#0F6E56" }}>Report Issue</p>
                  <p className="text-sm" style={{ color: "#444441" }}>Report missed collection</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#b8e0d4] bg-[#F6FAFA] hover:border-[#1D9E75]/30 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1F5EE] text-[#1D9E75] group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "#0F6E56" }}>View History</p>
                  <p className="text-sm" style={{ color: "#444441" }}>Past collection records</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;