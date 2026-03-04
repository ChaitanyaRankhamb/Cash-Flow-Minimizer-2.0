"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAppDataStore } from "@/store/useAppDataStore";

interface UpdateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  initialName: string;
  initialDescription?: string;
}

export function UpdateGroupModal({
  open,
  onOpenChange,
  groupId,
  initialName,
  initialDescription,
}: UpdateGroupModalProps) {
  const [groupName, setGroupName] = useState(initialName);
  const [description, setDescription] = useState(
    initialDescription || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync when modal opens with new data
  useEffect(() => {
    if (open) {
      setGroupName(initialName);
      setDescription(initialDescription || "");
      setError(null);
    }
  }, [open, initialName, initialDescription]);

  const handleUpdateGroup = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await apiFetch(
        `http://localhost:4000/groups/${groupId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: groupName.trim() === "" ? initialName : groupName.trim(),
            description: description.trim(),
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setError(result?.error);
      }

      // Refresh global app data
      const refresh = await apiFetch(
        "http://localhost:4000/app-data",
        {
          method: "GET",
        }
      );

      const json = await refresh.json();

      if (refresh.ok && json.success) {
        const setAppData =
          useAppDataStore.getState().setAppData;
        setAppData(json.data);
      }

      onOpenChange(false);
    } catch (err: any) {
      if (err.name === "TypeError") {
        setError(
          "Unable to connect to server. Please try again."
        );
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-md gap-6 rounded-2xl border-border bg-card p-6 shadow-xl">
        {/* Header */}
        <div className="space-y-2">
          <DialogTitle className="text-xl font-bold text-foreground">
            Update Group
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Modify the group name or description
          </DialogDescription>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Group Name */}
          <div className="space-y-2">
            <Label
              htmlFor="group-name"
              className="text-sm font-medium text-foreground"
            >
              Group Name{" "}
              <span className="text-muted-foreground">
                (Optional)
              </span>
            </Label>
            <Input
              id="group-name"
              type="text"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError(null);
              }}
              disabled={isLoading}
              className="rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-foreground"
            >
              Description{" "}
              <span className="text-muted-foreground">
                (Optional)
              </span>
            </Label>
            <Textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              disabled={isLoading}
              className="rounded-lg resize-none"
            />
          </div>

          {/* Info Card */}
          <Card className="p-3 bg-muted/40 border-border/50 flex items-start gap-3">
            <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Only group admin can update group details.
            </p>
          </Card>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpdateGroup}
            disabled={isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 transition-all"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground"></div>
                Updating…
              </div>
            ) : (
              "Update Group"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}