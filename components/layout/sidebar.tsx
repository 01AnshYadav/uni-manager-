"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";
import {
  Home,
  Megaphone,
  BookOpen,
  CalendarDays,
  Users,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/daily-logs", label: "Daily Logs", icon: CalendarDays },
  { href: "/students", label: "Students", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isCR, isAdmin } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r bg-card h-screen sticky top-0">
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">U</span>
          </div>
          <span className="font-bold text-lg">Uni Manager</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-3">
        {isAdmin && (
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg">
            <Shield className="h-3.5 w-3.5" />
            Admin
          </div>
        )}
        {!isAdmin && isCR && (
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg">
            <Shield className="h-3.5 w-3.5" />
            Class Representative
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate max-w-[140px]">
            {user?.email}
          </span>
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <LogoutButton compact />
          </div>
        </div>
      </div>
    </aside>
  );
}
