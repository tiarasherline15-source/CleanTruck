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
  in_progress: { label: "In Progress", icon: Truck, variant: "warning" as const },
  completed: { label: "Completed", icon: CheckCircle2, variant: "success" as const },
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
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card hidden lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Recycle className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">WeMS</span>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "overview" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Home className="h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "requests" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Truck className="h-4 w-4" />
            My Requests
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "schedule" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Schedule Pickup
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "settings" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
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
            <h1 className="text-xl font-semibold">Welcome, John 👋</h1>
            <p className="text-sm text-muted-foreground">Here's your waste collection overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-2">
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

          {/* Recent Requests */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>Your latest waste collection requests</CardDescription>
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
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{request.wasteType}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.date} at {request.time}
                          </p>
                        </div>
                      </div>
                      <Badge variant={status.variant === "warning" ? "secondary" : status.variant === "success" ? "default" : status.variant}>
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
            <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Schedule New Pickup</p>
                  <p className="text-sm text-muted-foreground">Request waste collection</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground group-hover:scale-110 transition-transform">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Report Issue</p>
                  <p className="text-sm text-muted-foreground">Report missed collection</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">View History</p>
                  <p className="text-sm text-muted-foreground">Past collection records</p>
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