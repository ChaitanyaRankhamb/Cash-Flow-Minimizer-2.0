"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/settlements/page-header";
import { SettlementStatsCards } from "@/components/settlements/stats-cards";
import { FilterBar } from "@/components/settlements/filter-bar";
import { SettlementsList } from "@/components/settlements/settlement-list";
import { SettleModal } from "@/components/settlements/settle-modal";
import { ExportModal } from "@/components/settlements/export-modal";
import { SettlementHistory } from "@/components/settlements/settlement-history";
import { DebtGraph } from "@/components/settlements/debt-graph";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/leftbar";

interface Settlement {
  id: string;
  from: {
    name: string;
    avatar?: string;
    initials: string;
  };
  to: {
    name: string;
    avatar?: string;
    initials: string;
  };
  amount: number;
  group: string;
  date: string;
  status: "pending" | "settled";
}

interface HistoryItem {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  method: string;
}

// Mock data
const MOCK_SETTLEMENTS: Settlement[] = [
  {
    id: "settle-1",
    from: { name: "Alice Johnson", initials: "AJ" },
    to: { name: "You", initials: "YU" },
    amount: 125.5,
    group: "Summer Trip",
    date: "2024-02-25",
    status: "pending",
  },
  {
    id: "settle-2",
    from: { name: "You", initials: "YU" },
    to: { name: "Bob Smith", initials: "BS" },
    amount: 85.75,
    group: "Apartment Rent",
    date: "2024-02-24",
    status: "pending",
  },
  {
    id: "settle-3",
    from: { name: "Charlie Brown", initials: "CB" },
    to: { name: "You", initials: "YU" },
    amount: 45.0,
    group: "Dinner Club",
    date: "2024-02-23",
    status: "settled",
  },
  {
    id: "settle-4",
    from: { name: "Diana Prince", initials: "DP" },
    to: { name: "Alice Johnson", initials: "AJ" },
    amount: 200.0,
    group: "Summer Trip",
    date: "2024-02-22",
    status: "pending",
  },
];

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "hist-1",
    from: "Eve Wilson",
    to: "You",
    amount: 67.5,
    date: "2024-02-20",
    method: "Bank Transfer",
  },
  {
    id: "hist-2",
    from: "You",
    to: "Frank Davis",
    amount: 150.0,
    date: "2024-02-18",
    method: "UPI",
  },
];

export default function SettlementsPage() {
  const [settlements, setSettlements] =
    useState<Settlement[]>(MOCK_SETTLEMENTS);
  const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY);

  // Modal states
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] =
    useState<Settlement | null>(null);

  // Filter states
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "highest">("newest");

  // Calculate stats
  const stats = useMemo(() => {
    const youOwe = settlements
      .filter((s) => s.status === "pending" && s.from.name === "You")
      .reduce((sum, s) => sum + s.amount, 0);

    const youAreOwed = settlements
      .filter((s) => s.status === "pending" && s.to.name === "You")
      .reduce((sum, s) => sum + s.amount, 0);

    return {
      youOwe,
      youAreOwed,
      netPosition: youAreOwed - youOwe,
    };
  }, [settlements]);

  // Filter and sort settlements
  const filteredSettlements = useMemo(() => {
    let result = [...settlements];

    // Group filter
    if (selectedGroup) {
      result = result.filter((s) => s.group === selectedGroup);
    }

    // Status filter
    if (selectedStatus) {
      result = result.filter((s) => s.status === selectedStatus);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "highest") return b.amount - a.amount;
      return 0;
    });

    return result;
  }, [settlements, selectedGroup, selectedStatus, sortBy]);

  // Get unique groups
  const groups = Array.from(new Set(settlements.map((s) => s.group)));

  // Get unique users for debt graph
  const allUsers = Array.from(
    new Set([
      ...settlements.map((s) => s.from.name),
      ...settlements.map((s) => s.to.name),
    ]),
  ).map((name) => {
    const settlement = settlements.find(
      (s) => s.from.name === name || s.to.name === name,
    );
    const user =
      settlement?.from.name === name ? settlement.from : settlement?.to;
    return (
      user || {
        name,
        initials: name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
      }
    );
  });

  const handleSettleClick = (id: string) => {
    const settlement = settlements.find((s) => s.id === id);
    if (settlement) {
      setSelectedSettlement(settlement);
      setShowSettleModal(true);
    }
  };

  const handleSettleConfirm = async (
    settlementId: string,
    paymentMethod: string,
  ) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSettlements((prev) =>
      prev.map((s) =>
        s.id === settlementId ? { ...s, status: "settled" as const } : s,
      ),
    );

    // Add to history
    const settlement = settlements.find((s) => s.id === settlementId);
    if (settlement) {
      setHistory((prev) => [
        {
          id: `hist-${Date.now()}`,
          from: settlement.from.name,
          to: settlement.to.name,
          amount: settlement.amount,
          date: new Date().toISOString().split("T")[0],
          method:
            paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
        },
        ...prev,
      ]);
    }

    toast.success("Settlement marked as completed");
  };

  const handleSettleAll = async () => {
    const pendingCount = settlements.filter(
      (s) => s.status === "pending",
    ).length;

    if (pendingCount === 0) return;

    // Show confirmation
    const confirmed = window.confirm(
      `Mark all ${pendingCount} pending settlements as settled?`,
    );
    if (!confirmed) return;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSettlements((prev) =>
      prev.map((s) =>
        s.status === "pending" ? { ...s, status: "settled" as const } : s,
      ),
    );

    toast.success(`All ${pendingCount} settlements marked as completed`);
  };

  const handleExport = async (format: "csv" | "pdf") => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In a real app, this would generate and download the file
    console.log("[v0] Exporting settlements as", format);
  };

  const hasPendingSettlements = settlements.some((s) => s.status === "pending");

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar already uses sidebar tokens */}
      <Sidebar />

      <div className="ml-64 flex-1 flex-col overflow-hidden">
        {/* Header should use bg-card + border-border internally */}
        <Header />

        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Page Header */}
            <PageHeader
              onSettleAllClick={handleSettleAll}
              onExportClick={() => setShowExportModal(true)}
              hasPending={hasPendingSettlements}
            />

            {/* Stats Cards */}
            <section className="py-8">
              <SettlementStatsCards
                youOwe={stats.youOwe}
                youAreOwed={stats.youAreOwed}
                netPosition={stats.netPosition}
              />
            </section>

            {/* Filter Bar */}
            <section className="py-4">
              <FilterBar
                selectedGroup={selectedGroup}
                onGroupChange={setSelectedGroup}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                sortBy={sortBy}
                onSortChange={setSortBy}
                groups={groups}
              />
            </section>

            {/* Settlements List */}
            <section className="py-8">
              <SettlementsList
                settlements={filteredSettlements}
                onSettle={handleSettleClick}
              />
            </section>

            {/* Debt Graph */}
            {allUsers.length > 0 && (
              <section className="py-8">
                <DebtGraph
                  users={allUsers.map((u) => ({
                    id: u.name.replace(/\s+/g, "-").toLowerCase(),
                    name: u.name,
                    initials: u.initials,
                  }))}
                  debts={settlements.map((s) => ({
                    from: s.from.name,
                    to: s.to.name,
                    amount: s.amount,
                  }))}
                />
              </section>
            )}

            {/* Settlement History */}
            <section className="py-8">
              <SettlementHistory items={history} />
            </section>
          </div>

          {/* Settle Transaction Modal */}
          <SettleModal
            open={showSettleModal}
            onOpenChange={setShowSettleModal}
            settlementId={selectedSettlement?.id || null}
            from={selectedSettlement?.from || null}
            to={selectedSettlement?.to || null}
            amount={selectedSettlement?.amount || 0}
            group={selectedSettlement?.group || ""}
            onConfirm={handleSettleConfirm}
          />

          {/* Export Modal */}
          <ExportModal
            open={showExportModal}
            onOpenChange={setShowExportModal}
            onExport={handleExport}
          />
        </main>
      </div>
    </div>
  );
}
