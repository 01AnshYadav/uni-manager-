"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (compact) {
    return (
      <Button onClick={logout} variant="ghost" size="icon" className="h-8 w-8" title="Logout">
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button onClick={logout} variant="outline" size="sm">
      Logout
    </Button>
  );
}
