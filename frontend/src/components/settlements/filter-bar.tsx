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
} from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Filter, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  selectedGroup?: string | null;
  onGroupChange?: (group: string | null) => void;
  selectedStatus?: string | null;
  onStatusChange?: (status: string | null) => void;
  sortBy?: 'highest' | 'newest';
  onSortChange?: (sort: 'highest' | 'newest') => void;
  groups?: string[];
}

export function FilterBar({
  selectedGroup = null,
  onGroupChange,
  selectedStatus = null,
  onStatusChange,
  sortBy = 'newest',
  onSortChange,
  groups = [],
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-40 flex flex-col gap-4 bg-background/80 backdrop-blur-md py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-2 flex-wrap flex-1">
        {groups.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border hover:bg-secondary/50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                {selectedGroup ? 'Group: ' + selectedGroup : 'All Groups'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filter by Group</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={selectedGroup || 'all'}
                onValueChange={(v) => onGroupChange?.(v === 'all' ? null : v)}
              >
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
              {selectedStatus ? 'Status: ' + selectedStatus : 'All Status'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedStatus || 'all'}
              onValueChange={(v) => onStatusChange?.(v === 'all' ? null : v)}
            >
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
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => onSortChange?.(v as any)}>
              <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="highest">Highest Amount</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
