"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAppDataStore } from "@/store/useAppDataStore";

interface ChartItem {
  name: string;
  value: number;
  color: string;
}

function getColorFromClass(className: string) {
  const temp = document.createElement("div");
  temp.className = className;
  temp.style.display = "none";
  document.body.appendChild(temp);

  const color = getComputedStyle(temp).backgroundColor;
  document.body.removeChild(temp);

  return color;
}

export function CircularProgressCard() {
  const appData = useAppDataStore((state) => state.appData);
  const loading = useAppDataStore((state) => state.loading);
  const error = useAppDataStore((state) => state.error);

  const activeDebtStatus = appData?.dashboard?.debtStatus;

  const [data, setData] = useState<ChartItem[]>([]);

  useEffect(() => {
    if (!activeDebtStatus) return;

    const success = getColorFromClass("bg-success");
    const destructive = getColorFromClass("bg-destructive");
    const neutral = getColorFromClass("bg-chart-3");

    setData([
      {
        name: "You are owed",
        value: activeDebtStatus.youAreOwed ?? 0,
        color: success,
      },
      {
        name: "You owe",
        value: activeDebtStatus.youOwe ?? 0,
        color: destructive,
      },
      {
        name: "Balanced groups",
        value: activeDebtStatus.balancedGroups ?? 0,
        color: neutral,
      },
    ]);
  }, [activeDebtStatus]);

  const totalAmount = activeDebtStatus?.totalActiveDebtAmount ?? 0;
  const totalGroups = activeDebtStatus?.totalActiveGroups ?? 0;
  const joinedGroups =
    appData?.dashboard?.globalFinancialOverview?.totalGroupsJoined ?? 0;

  // 🔥 LOADING STATE
  if (loading) {
    return (
      <Card className="bg-card border border-border rounded-2xl p-6 h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">
          Loading Active Debt Status...
        </p>
      </Card>
    );
  }

  // // 🔥 ERROR STATE
  // if (error) {
  //   return (
  //     <Card className="bg-card border border-destructive rounded-2xl p-6 h-full flex items-center justify-center">
  //       <p className="text-destructive text-sm">
  //         Failed to load dashboard data.
  //       </p>
  //     </Card>
  //   );
  // }

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-md">
      <h3 className="text-lg font-semibold tracking-tight text-primary mb-6">
        Active Debt Status
      </h3>

      <div className="flex gap-10">
        {/* Chart */}
        <div className="flex-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="flex flex-col justify-center gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Total Active Amount
            </p>
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              ₹ {totalAmount.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalGroups} / {joinedGroups} Groups Active
            </p>
          </div>

          <div className="space-y-3">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.name} ₹ {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}