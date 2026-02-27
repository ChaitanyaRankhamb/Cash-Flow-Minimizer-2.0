'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, ArrowUpDown, Calendar } from 'lucide-react';
import { useState } from 'react';

interface SearchFilterBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedGroup?: string | null;
  onGroupChange?: (group: string | null) => void;
  selectedStatus?: string | null;
  onStatusChange?: (status: string | null) => void;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest';
  onSortChange?: (sort: 'newest' | 'oldest' | 'highest' | 'lowest') => void;
  dateRange?: { from?: string; to?: string };
  onDateRangeChange?: (range: { from?: string; to?: string }) => void;
  groups?: string[];
}

export function SearchFilterBar({
  searchQuery = '',
  onSearchChange,
  selectedGroup = null,
  onGroupChange,
  selectedStatus = null,
  onStatusChange,
  sortBy = 'newest',
  onSortChange,
  groups = [],
}: SearchFilterBarProps) {
  return (
    <div className="sticky top-0 z-40 flex flex-col gap-4 bg-background/80 backdrop-blur-md py-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 md:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search expenses…"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-10 bg-secondary/50 border-border focus-visible:ring-2 focus-visible:ring-ring transition-all"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {groups.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border hover:bg-secondary/50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                {selectedGroup ? 'Group: ' + selectedGroup : 'Group'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Group</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedGroup || 'all'} onValueChange={(v) => onGroupChange?.(v === 'all' ? null : v)}>
                <DropdownMenuRadioItem value="all">All Groups</DropdownMenuRadioItem>
                {groups.map((group) => (
                  <DropdownMenuRadioItem key={group} value={group}>
                    {group}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border hover:bg-secondary/50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              {selectedStatus ? 'Status: ' + selectedStatus : 'Status'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={selectedStatus || 'all'} onValueChange={(v) => onStatusChange?.(v === 'all' ? null : v)}>
              <DropdownMenuRadioItem value="all">All Status</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="settled">Settled</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border hover:bg-secondary/50 transition-colors"
            >
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => onSortChange?.(v as any)}>
              <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="highest">Highest Amount</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lowest">Lowest Amount</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
