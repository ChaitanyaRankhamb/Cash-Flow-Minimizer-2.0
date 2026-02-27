"use client";

import { Header } from "@/components/dashboard/header";
import { CreateGroupModal } from "@/components/groups/create-group-model";
import { GroupsGrid } from "@/components/groups/groups-grid";
import { PageHeader } from "@/components/groups/page-header";
import { SearchFilterBar } from "@/components/groups/search-filter-bar";
import { StatsCards } from "@/components/groups/stats-card";
import { Sidebar } from "@/components/leftbar";
import { useState } from "react";

export default function GroupsPage() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);

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
            <PageHeader onCreateGroupClick={() => setShowCreateGroup(true)} />

            {/* Stats Cards */}
            <section className="py-8">
              <StatsCards />
            </section>

            {/* Search and Filter Bar */}
            <section className="py-4">
              <SearchFilterBar />
            </section>

            {/* Groups Grid */}
            <section className="py-8">
              <GroupsGrid />
            </section>
          </div>

          {/* Create Group Modal */}
          <CreateGroupModal
            open={showCreateGroup}
            onOpenChange={setShowCreateGroup}
          />
        </main>
      </div>
    </div>
  );
}
