"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, Mail, User } from "lucide-react";
import { useAppDataStore } from "@/store/useAppDataStore";
import { Button } from "@/components/ui/button";

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  onLogin: () => void;
}

export function ProfilePanel({
  open,
  onClose,
  onLogout,
  onLogin,
}: ProfilePanelProps) {
  const appData = useAppDataStore((s) => s.appData);
  const user = appData?.dashboard?.user;

  const firstChar = user?.username?.charAt(0).toUpperCase();

  const username = appData?.dashboard.user.username;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-2 w-60 rounded-2xl bg-popover text-popover-foreground border border-border shadow-2xl z-50"
          >
            <div className="p-6">
              {/* Avatar + Name */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold shadow-md">
                  {firstChar}
                </div>

                <div className="flex flex-col justify-center items-center">
                  <p className="text-base font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 opacity-70" />
                    {user?.username}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 opacity-60" />
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border my-4" />

              {/* Logout */}
              {username === "Guest" ? (
                <Button
                  variant="success"
                  onClick={onLogin}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
