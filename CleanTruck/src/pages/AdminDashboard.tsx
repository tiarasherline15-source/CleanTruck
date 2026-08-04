import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, Users, Truck, FileBarChart, Settings,
  LogOut, User, TrendingUp, TrendingDown, Package,
  Recycle, Scale, MapPin, Calendar, Search, Filter,
  MoreVertical, Edit, Trash2, Eye, Download, ChevronDown,
  BarChart3, PieChart, Activity, AlertTriangle, CheckCircle2, Clock
} from "lucide-react";

// Mock analytics data
const analyticsData = {
  totalCollections: 2847,
  totalWeight: "42.5 tons",
  activeUsers: 1234,
  activeCollectors: 45,
  collectionRate: 94.5,
  recyclingRate: 67.8,
  weeklyGrowth: 12.3,
  avgResponseTime: "2.4 hrs",
};

const weeklyStats = [
  { day: "Mon", collections: 412, weight: 5.8 },
  { day: "Tue", collections: 389, weight: 5.2 },
  { day: "Wed", collections: 445, weight: 6.1 },
  { day: "Thu", collections: 398, weight: 5.4 },
  { day: "Fri", collections: 467, weight: 6.5 },
  { day: "Sat", collections: 378, weight: 5.1 },
  { day: "Sun", collections: 358, weight: 4.8 },
];

const wasteDistribution = [
  { type: "General Waste", percentage: 35, color: "bg-muted-foreground" },
  { type: "Recyclables", percentage: 28, color: "bg-primary" },
  { type: "Organic Waste", percentage: 25, color: "bg-success" },
  { type: "E-Waste", percentage: 12, color: "bg-secondary" },
];

// Mock users data
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "resident", status: "active", collections: 24, joinDate: "2025-08-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "resident", status: "active", collections: 31, joinDate: "2025-07-22" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "collector", status: "active", collections: 156, joinDate: "2025-06-10" },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "collector", status: "active", collections: 142, joinDate: "2025-06-15" },
  { id: 5, name: "Bob Brown", email: "bob@example.com", role: "resident", status: "inactive", collections: 8, joinDate: "2025-09-01" },
  { id: 6, name: "Alice Davis", email: "alice@example.com", role: "resident", status: "active", collections: 19, joinDate: "2025-10-05" },
  { id: 7, name: "Tom Wilson", email: "tom@example.com", role: "collector", status: "on_leave", collections: 89, joinDate: "2025-07-01" },
  { id: 8, name: "Emma Clark", email: "emma@example.com", role: "admin", status: "active", collections: 0, joinDate: "2025-05-20" },
];

// Mock collection reports
const mockReports = [
  { id: 1, period: "January 2026", totalCollections: 2847, totalWeight: "42.5 tons", recyclingRate: 67.8, status: "completed" },
  { id: 2, period: "December 2025", totalCollections: 2654, totalWeight: "39.2 tons", recyclingRate: 65.4, status: "completed" },
  { id: 3, period: "November 2025", totalCollections: 2498, totalWeight: "36.8 tons", recyclingRate: 63.2, status: "completed" },
  { id: 4, period: "October 2025", totalCollections: 2312, totalWeight: "34.1 tons", recyclingRate: 61.5, status: "completed" },
];

const sectorReports = [
  { sector: "Sector 1", collections: 456, weight: "6.8 tons", efficiency: 96.2, collectors: 8 },
  { sector: "Sector 2", collections: 398, weight: "5.9 tons", efficiency: 94.5, collectors: 7 },
  { sector: "Sector 3", collections: 521, weight: "7.7 tons", efficiency: 97.8, collectors: 9 },
  { sector: "Sector 5", collections: 487, weight: "7.2 tons", efficiency: 95.1, collectors: 8 },
  { sector: "Sector 7", collections: 412, weight: "6.1 tons", efficiency: 93.8, collectors: 6 },
];

const alerts = [
  { id: 1, type: "warning", message: "High volume expected in Sector 3 tomorrow", time: "2 hours ago" },
  { id: 2, type: "info", message: "New collector Mike J. completed onboarding", time: "4 hours ago" },
  { id: 3, type: "success", message: "Monthly recycling target achieved!", time: "1 day ago" },
  { id: 4, type: "error", message: "Collection delay reported in Sector 7", time: "1 day ago" },
];

const roleConfig = {
  admin: { label: "Admin", className: "bg-destructive/10 text-destructive border-destructive/20" },
  collector: { label: "Collector", className: "bg-secondary/10 text-secondary border-secondary/20" },
  resident: { label: "Resident", className: "bg-primary/10 text-primary border-primary/20" },
};

const statusConfig = {
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-muted" },
  on_leave: { label: "On Leave", className: "bg-warning/10 text-warning border-warning/20" },
};

const alertTypeConfig = {
  warning: { icon: AlertTriangle, className: "text-warning bg-warning/10" },
  info: { icon: Activity, className: "text-primary bg-primary/10" },
  success: { icon: CheckCircle2, className: "text-success bg-success/10" },
  error: { icon: AlertTriangle, className: "text-destructive bg-destructive/10" },
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: "Total Collections", value: analyticsData.totalCollections.toLocaleString(), icon: Package, color: "text-primary", trend: "+12.3%", trendUp: true },
    { label: "Total Weight", value: analyticsData.totalWeight, icon: Scale, color: "text-secondary", trend: "+8.5%", trendUp: true },
    { label: "Active Users", value: analyticsData.activeUsers.toLocaleString(), icon: Users, color: "text-accent", trend: "+5.2%", trendUp: true },
    { label: "Active Collectors", value: analyticsData.activeCollectors.toString(), icon: Truck, color: "text-success", trend: "+2", trendUp: true },
  ];

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "reports", label: "Collection Reports", icon: FileBarChart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const maxCollections = Math.max(...weeklyStats.map(d => d.collections));

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card hidden lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Recycle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold">WeMS</span>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? "bg-primary text-primary-foreground" 
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
            <h1 className="text-xl font-semibold">Admin Dashboard 📊</h1>
            <p className="text-sm text-muted-foreground">System overview and management</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-success' : 'text-destructive'}`}>
                      {stat.trendUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {stat.trend}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overview Section */}
          {(activeTab === "overview" || activeTab === "analytics") && (
            <>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Weekly Collections Chart */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Weekly Collections
                    </CardTitle>
                    <CardDescription>Collection trends over the past week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between gap-2 h-48">
                      {weeklyStats.map((day) => (
                        <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                          <div className="w-full flex flex-col items-center">
                            <span className="text-xs text-muted-foreground mb-1">{day.collections}</span>
                            <div 
                              className="w-full bg-primary/80 rounded-t-md transition-all hover:bg-primary"
                              style={{ height: `${(day.collections / maxCollections) * 140}px` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Waste Distribution */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-secondary" />
                      Waste Distribution
                    </CardTitle>
                    <CardDescription>Breakdown by waste type</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {wasteDistribution.map((item) => (
                      <div key={item.type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.type}</span>
                          <span className="text-muted-foreground">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" className="fill-none stroke-muted stroke-[8]" />
                        <circle 
                          cx="48" cy="48" r="40" 
                          className="fill-none stroke-success stroke-[8]"
                          strokeDasharray={`${analyticsData.collectionRate * 2.51} 251`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xl font-bold">{analyticsData.collectionRate}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Collection Rate</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" className="fill-none stroke-muted stroke-[8]" />
                        <circle 
                          cx="48" cy="48" r="40" 
                          className="fill-none stroke-primary stroke-[8]"
                          strokeDasharray={`${analyticsData.recyclingRate * 2.51} 251`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xl font-bold">{analyticsData.recyclingRate}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Recycling Rate</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="flex h-24 items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-secondary">{analyticsData.avgResponseTime}</p>
                        <Clock className="h-5 w-5 mx-auto mt-2 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Avg Response Time</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="flex h-24 items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-accent">+{analyticsData.weeklyGrowth}%</p>
                        <TrendingUp className="h-5 w-5 mx-auto mt-2 text-success" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Weekly Growth</p>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-accent" />
                    Recent Activity & Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.map((alert) => {
                    const config = alertTypeConfig[alert.type as keyof typeof alertTypeConfig];
                    const Icon = config.icon;
                    return (
                      <div key={alert.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.className}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </>
          )}

          {/* User Management */}
          {activeTab === "users" && (
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage residents, collectors, and administrators</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <User className="h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["all", "resident", "collector", "admin"].map((role) => (
                      <Button 
                        key={role}
                        variant={roleFilter === role ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRoleFilter(role)}
                        className="capitalize"
                      >
                        {role === "all" ? "All Users" : role + "s"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Collections</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Join Date</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <User className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={roleConfig[user.role as keyof typeof roleConfig].className}>
                              {roleConfig[user.role as keyof typeof roleConfig].label}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={statusConfig[user.status as keyof typeof statusConfig].className}>
                              {statusConfig[user.status as keyof typeof statusConfig].label}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{user.collections}</td>
                          <td className="py-3 px-4 text-muted-foreground">{user.joinDate}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
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
              </CardContent>
            </Card>
          )}

          {/* Collection Reports */}
          {activeTab === "reports" && (
            <>
              {/* Monthly Reports */}
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileBarChart className="h-5 w-5 text-primary" />
                        Monthly Reports
                      </CardTitle>
                      <CardDescription>Historical collection data and trends</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
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
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Collections</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total Weight</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Recycling Rate</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockReports.map((report) => (
                          <tr key={report.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                  <Calendar className="h-4 w-4" />
                                </div>
                                <span className="font-medium">{report.period}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium">{report.totalCollections.toLocaleString()}</td>
                            <td className="py-3 px-4 text-muted-foreground">{report.totalWeight}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Progress value={report.recyclingRate} className="w-20 h-2" />
                                <span className="text-sm text-muted-foreground">{report.recyclingRate}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className="bg-success/10 text-success border-success/20">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="h-4 w-4" />
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-secondary" />
                    Sector Performance
                  </CardTitle>
                  <CardDescription>Collection efficiency by sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sector</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Collections</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Weight</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Efficiency</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Collectors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sectorReports.map((sector) => (
                          <tr key={sector.sector} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                  <MapPin className="h-4 w-4" />
                                </div>
                                <span className="font-medium">{sector.sector}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium">{sector.collections}</td>
                            <td className="py-3 px-4 text-muted-foreground">{sector.weight}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
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
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-muted-foreground" />
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
      </main>
    </div>
  );
};

export default AdminDashboard;