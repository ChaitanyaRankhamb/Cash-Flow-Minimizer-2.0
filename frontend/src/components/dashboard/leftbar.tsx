"use client";

import { useState } from "react";
import { LayoutDashboard, Users, CreditCard, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useAppDataStore } from "@/store/useAppDataStore"; // adjust path if needed
import { ProfilePanel } from "./profile-panel";
import { useAuthStore } from "@/store/useAuthStore";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // get accessToken
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearAccessToken = useAuthStore((s) => s.clearAccessToken);
  const clearAppData = useAppDataStore((s) => s.clearAppData);

  const [profileOpen, setProfileOpen] = useState(false);

  const appData = useAppDataStore((s) => s.appData);
  const userData = appData?.dashboard?.user;

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Groups", href: "/groups" },
    { icon: CreditCard, label: "Expenses", href: "/expenses" },
    { icon: Users, label: "Settlements", href: "/settlements" },
  ];

  // logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        // make appData to guest mode
        clearAppData();

        // clear access token
        clearAccessToken();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // login handler
  const handleLogin = async () => {
    router.push("/login");
  };

  return (
    <>
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0">
        {/* Logo Section */}
        <div className="px-6 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Cash-Flow</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                )}
              >
                <Icon className="w-5 h-5 opacity-80" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Button */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => setProfileOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-sidebar-accent/60 group"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold text-sm shadow-sm">
              {userData?.username?.charAt(0).toUpperCase() ?? "U"}
            </div>

            {/* User Info */}
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-sidebar-foreground">
                {userData?.username ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground">View Profile</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Profile Panel */}
      <ProfilePanel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
    </>
  );
}
