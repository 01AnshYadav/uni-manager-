"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  role: string | null;
  isLoading: boolean;
  isCR: boolean;
  isAdmin: boolean;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  isCR: false,
  isAdmin: false,
  refreshRole: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const resolveRole = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("admins")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      return data?.role ?? null;
    },
    [supabase],
  );

  const refreshRole = useCallback(async () => {
    if (!user) return;
    const r = await resolveRole(user.id);
    setRole(r);
  }, [user, resolveRole]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) {
        const r = await resolveRole(data.user.id);
        setRole(r);
      }
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          const r = await resolveRole(session.user.id);
          setRole(r);
        } else {
          setUser(null);
          setRole(null);
        }
        setIsLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, [supabase, resolveRole]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isCR: role === "cr" || role === "admin",
        isAdmin: role === "admin",
        refreshRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
