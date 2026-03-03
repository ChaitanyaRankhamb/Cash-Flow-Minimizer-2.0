"use client";

import { Card } from "@/components/ui/card";
import { useAppDataStore } from "@/store/useAppDataStore";

interface StatCardProps {
  label: string;
  value: number;
  type?: "neutral" | "success" | "destructive";
}

function StatCard({ label, value, type = "neutral" }: StatCardProps) {
  const getColorClasses = () => {
    switch (type) {
      case "success":
        return "text-success";
      case "destructive":
        return "text-destructive";
      default:
        return "text-foreground";
    }
  };

  return (
    <Card className="overflow-hidden border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:scale-105 transition-all duration-200">
      <div className="p-6 space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={`text-3xl font-bold ${getColorClasses()}`}>{value}</p>
      </div>
    </Card>
  );
}

export function StatsCards() {
  // get group data
  const appData = useAppDataStore((s) => s.appData);
  const loading = useAppDataStore((s) => s.loading);
  const error = useAppDataStore((s) => s.error);

  const groupData = appData?.groups.header;

  // 🔥 LOADING STATE
  if (loading) {
    return (
      <Card className="bg-card border border-border rounded-2xl p-6 h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">
          Loading Groups Status...
        </p>
      </Card>
    );
  }

  // 🔥 ERROR STATE
  if (error) {
    return (
      <Card className="bg-card border border-destructive rounded-2xl p-6 h-full flex items-center justify-center">
        <p className="text-destructive text-sm">
          Failed to load Groups data.
        </p>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        label="Total Groups"
        value={groupData?.totalGroupsJoined ?? 0}
      />
      <StatCard
        label="You Owe"
        value={groupData?.youOwe ?? 0}
        type="destructive"
      />
      <StatCard
        label="You Are Owed"
        value={groupData?.youAreOwed ?? 0}
        type="success"
      />
    </div>
  );
}
