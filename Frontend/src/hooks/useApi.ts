import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  PickupRequest,
  Route,
  RouteStop,
  User,
  Notification,
  CollectionHistory,
  PaginatedResponse,
  CreateCollectorPayload,
  CreatedCollector,
} from "@/lib/types";

//  Pickup Requests 
export function usePickupRequests() {
  return useQuery({
    queryKey: ["pickup-requests"],
    queryFn: () =>
      api.get<PaginatedResponse<PickupRequest> | PickupRequest[]>("/pickups/"),
  });
}

export function useMyPickupRequests() {
  return useQuery({
    queryKey: ["my-pickup-requests"],
    queryFn: () =>
      api.get<PaginatedResponse<PickupRequest> | PickupRequest[]>("/pickups/my/"),
  });
}

export function useCreatePickupRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PickupRequest>) =>
      api.post<PickupRequest>("/pickups/", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pickup-requests"] });
      qc.invalidateQueries({ queryKey: ["my-pickup-requests"] });
    },
  });
}

export function useUpdatePickupRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PickupRequest> }) =>
      api.patch<PickupRequest>(`/pickups/${id}/`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pickup-requests"] });
      qc.invalidateQueries({ queryKey: ["my-pickup-requests"] });
      qc.invalidateQueries({ queryKey: ["collector-pickups"] });
      qc.invalidateQueries({ queryKey: ["routes"] });
      qc.invalidateQueries({ queryKey: ["collection-history"] });
    },
  });
}

export function useCollectorPickups() {
  return useQuery({
    queryKey: ["collector-pickups"],
    queryFn: () =>
      api.get<PaginatedResponse<PickupRequest> | PickupRequest[]>("/pickups/assigned/"),
  });
}

// Routes 
export function useRoutes() {
  return useQuery({
    queryKey: ["routes"],
    queryFn: () =>
      api.get<PaginatedResponse<Route> | Route[]>("/routes/"),
  });
}

export function useUpdateRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Route> }) =>
      api.patch<Route>(`/routes/${id}/`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

export function useUpdateRouteStop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<RouteStop> }) =>
      api.patch<RouteStop>(`/route-stops/${id}/`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

// Users (Admin)
export function useUsers(params?: { search?: string; role?: string; page?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.role && params.role !== "all") searchParams.set("role", params.role);
  if (params?.page) searchParams.set("page", params.page.toString());

  const query = searchParams.toString();
  return useQuery({
    queryKey: ["users", params],
    queryFn: () =>
      api.get<PaginatedResponse<User> | User[]>(`/users/${query ? `?${query}` : ""}`),
  });
}

export function useCreateCollector() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCollectorPayload) =>
      api.post<CreatedCollector>("/users/create-collector/", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      api.patch<User>(`/users/${id}/`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/users/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// Notifications
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      api.get<PaginatedResponse<Notification> | Notification[]>("/notifications/"),
    refetchInterval: 30_000, // poll every 30s as fallback for WebSocket
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.patch(`/notifications/${id}/`, { is_read: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/notifications/mark-all-read/"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// Collection History 
export function useCollectionHistory() {
  return useQuery({
    queryKey: ["collection-history"],
    queryFn: () =>
      api.get<PaginatedResponse<CollectionHistory> | CollectionHistory[]>("/collection-history/"),
  });
}

//  Admin Analytics 
export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: () => api.get("/analytics/"),
  });
}

//  Reports
export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: () => api.get("/reports/"),
  });
}
