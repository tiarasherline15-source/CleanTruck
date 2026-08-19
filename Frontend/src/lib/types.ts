// User 
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "resident" | "collector" | "admin";
  status: "active" | "inactive" | "on_leave";
  phone: string;
  address: string;
  zone: string;
  profile_picture?: string;
  date_joined: string;
}

// Pickup Request
export interface PickupRequest {
  id: number;
  resident: number;
  collector?: number;
  route?: number;
  address: string;
  zone: string;
  waste_type: "General Waste" | "Recyclables" | "Organic Waste" | "E-Waste";
  scheduled_datetime: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "high" | "normal" | "low";
  notes: string;
  estimated_weight_kg: number | null;
  actual_weight_kg: number | null;
  created_at: string;
  updated_at: string;
}

// Route
export interface Route {
  id: number;
  name: string;
  collector: number | null;
  stops_count: number;
  distance_km: number | null;
  estimated_duration: string | null;
  status: "active" | "upcoming" | "completed";
  created_at: string;
  updated_at: string;
}

// Collection History
export interface CollectionHistory {
  id: number;
  pickup_request: number;
  collector: number | null;
  route: number | null;
  completed_at: string;
  duration: string | null;
  weight_kg: number | null;
  notes: string;
  created_at: string;
}

// Notification
export interface Notification {
  id: number;
  user: number | null;
  type: "warning" | "info" | "success" | "error";
  message: string;
  is_read: boolean;
  created_at: string;
}

//  Paginated Response 
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

//  Auth 
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  zone: string;
  role: "resident" | "collector" | "admin";
}
