import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AdminUserDTO } from "@mahama/shared-types";
import { api, tokenStore } from "../config.js";

interface AuthCtx {
  user: AdminUserDTO | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUserDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }
    api.me()
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.login({ email, password });
    tokenStore.set(r.token);
    tokenStore.refreshSet(r.refreshToken);
    setUser(r.user);
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
    location.href = "/login";
  };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("AuthProvider missing");
  return c;
}
