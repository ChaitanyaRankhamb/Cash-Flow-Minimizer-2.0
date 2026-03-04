"use client";

import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useAppDataStore } from "@/store/useAppDataStore";

export function Header() {
  const { setTheme } = useTheme();

  const appData = useAppDataStore((s) => s.appData);
  const loading = useAppDataStore((s) => s.loading);
  const error = useAppDataStore((s) => s.error);

  const userData = appData?.dashboard.user;

  return (
    <header className="bg-card border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="px-8 py-6 flex items-center justify-between">

        {/* Left Section */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">
            Welcome back, {userData?.username ?? "User"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Optimize. Settle. Simplify.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-border bg-background hover:bg-muted transition"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-popover border border-border text-popover-foreground"
            >
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button
            variant="outline"
            size="icon"
            className="relative hover:bg-muted transition"
          >
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
}
