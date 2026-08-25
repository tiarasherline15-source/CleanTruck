import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api, clearTokens, setTokens, getAccessToken } from "@/lib/api";
import type { User, AuthTokens, LoginPayload, RegisterPayload } from "@/lib/types";

//  Context shape 
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//  Provider 
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }
    try {
      const me = await api.get<User>("/users/me/");
      setUser(me);
      sessionStorage.setItem("user", JSON.stringify(me));
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Restore user from sessionStorage first for fast UI, then refresh from API
    const stored = sessionStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem("user");
      }
    }
    fetchUser();
  }, [fetchUser]);

  const login = async (payload: LoginPayload) => {
    const data = await api.post<AuthTokens>("/token/", {
      username: payload.email,
      password: payload.password,
    });
    setTokens(data.access, data.refresh);
    const me = await api.get<User>("/users/me/");
    setUser(me);
    sessionStorage.setItem("user", JSON.stringify(me));
  };

  const register = async (payload: RegisterPayload) => {
    await api.post<unknown>("/auth/register/", payload);
    // Auto-login after registration
    await login({ email: payload.email, password: payload.password });
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      sessionStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//  Hook 
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
