"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { GroupDetailsPanel } from "./group-details-panel";
import { AddMemberModal } from "./add-member-modal";
import { StoreGroup } from "./groups-grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoreVertical, Pencil, Trash, Eye } from "lucide-react";
import { UpdateGroupModal } from "./update-group-model";
import { DeleteGroupModal } from "./delete-group-model";

interface GroupCardProps {
  name: string;
  description: string;
  status: "active" | "balanced" | "settled" | "archived";
  totalExpenses: number;
  yourBalance: number;
  createdAt: Date;
  members: Array<{
    name: string;
    avatar: string;
    initials: string;
  }>;
  groupData: StoreGroup;
}

export function GroupCard({
  name,
  description,
  status,
  totalExpenses,
  yourBalance,
  createdAt,
  members,
  groupData,
}: GroupCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showDeleteGroup, setShowDeleteGroup] = useState(false);
  const [showUpdateGroup, setShowUpdateGroup] = useState(false);

  /* -----------------------------
     Status Styling
  ------------------------------*/
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "balanced":
      case "settled":
        return "bg-muted text-muted-foreground";
      case "archived":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  /* -----------------------------
     Balance Meaning
  ------------------------------*/
  const balanceLabel = useMemo(() => {
    if (yourBalance > 0) return "You are owed";
    if (yourBalance < 0) return "You owe";
    return "Settled";
  }, [yourBalance]);

  const getBalanceColor = () => {
    if (yourBalance > 0) return "text-success font-semibold";
    if (yourBalance < 0) return "text-destructive font-semibold";
    return "text-muted-foreground";
  };

  return (
    <>
      <Card
        className="overflow-hidden border border-border bg-card hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
        onClick={() => setShowDetails(true)}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex-1 flex-col">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className=" text-sm font-normal text-card-foreground opacity-50 mt-2 h-5">
              {description ?? ""}
            </p>
          </div>
          <Badge className={`ml-2 ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        {/* Members */}
        <div className="px-6 pb-4">
          <div className="flex items-center -space-x-2">
            {members.slice(0, 4).map((member, idx) => (
              <Avatar key={idx} className="h-8 w-8 border-2 border-card">
                <AvatarImage
                  src={member.avatar || undefined}
                  alt={member.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}

            {members.length > 4 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium text-muted-foreground border-2 border-card">
                +{members.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Expenses</span>
            <span className="font-semibold text-foreground">
              ₹{totalExpenses.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{balanceLabel}</span>
            <span className={getBalanceColor()}>
              {yourBalance === 0
                ? "₹0"
                : `₹${Math.abs(yourBalance).toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/30">
          <span className="text-xs text-muted-foreground">
            {"Date: "} {createdAt.toString().split("T")[0]}
          </span>

          <DropdownMenu onOpenChange={setShowMoreOptions}>
            <Tooltip open={showMoreOptions ? false : undefined}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-primary/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>

              <TooltipContent side="left">More options</TooltipContent>
            </Tooltip>

            <DropdownMenuContent side="left" align="end" className="w-40">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  // update logic
                  setShowUpdateGroup(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4 text-primary" />
                Update
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  // delete logic
                  setShowDeleteGroup(true);
                }}
              >
                <Trash className="mr-2 h-4 w-4 text-destructive" />
                Delete
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Details Panel */}
      <GroupDetailsPanel
        open={showDetails}
        onOpenChange={setShowDetails}
        groupData={groupData}
        members={members}
        onAddMemberClick={() => setShowAddMember(true)}
      />

      {/* Add Member Modal */}
      {groupData && (
        <AddMemberModal
          open={showAddMember}
          onOpenChange={setShowAddMember}
          groupName={groupData.groupName}
          groupId={groupData.id}
        />
      )}

      {/* Update Group Model */}
      <UpdateGroupModal 
      open={showUpdateGroup}
      onOpenChange={setShowUpdateGroup}
      groupId={groupData.id}
      initialName={groupData.groupName}
      initialDescription={groupData.description}
      />

      {/* Delete Group Model  */}
      <DeleteGroupModal 
      open={showDeleteGroup}
      onOpenChange={setShowDeleteGroup}
      groupName={groupData.groupName}
      groupId={groupData.id}
      groupStatus={groupData.groupStatus}
      />
    </>
  );
}
