"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { Shield } from "lucide-react";
import { useAppDataStore } from "@/store/useAppDataStore";
import { apiFetch } from "@/lib/api";

interface DeleteExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseName: string;
  expenseId: string;
  groupId: string;
}

export function DeleteExpenseModal({
  open,
  onOpenChange,
  expenseName,
  expenseId,
  groupId,
}: DeleteExpenseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Reset error when modal closes */
  useEffect(() => {
    if (!open) setError(null);
  }, [open]);

  const handleDelete = async () => {
    if (!groupId || !expenseId) {
      setError("Invalid expense data.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await apiFetch(
        `http://localhost:4000/groups/${groupId}/expenses/${expenseId}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setError(result?.message || "Failed to delete expense");
        return;
      }

      /* Refresh app data */
      const refresh = await apiFetch("http://localhost:4000/app-data");

      const json = await refresh.json();
      
      if (refresh.ok && json.success) {
        const setAppData = useAppDataStore.getState().setAppData;
        setAppData(json.data);
      }

      onOpenChange(false);
    } catch (err: any) {
      if (err.name === "TypeError") {
        setError("Unable to connect to server. Please try again.");
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-destructive">
            Delete Expense
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              "{expenseName}"
            </span>
            ?
            <br />
            <span className="text-destructive font-medium">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Info Card */}
        <Card className="p-3 bg-muted/40 border-border/50 flex items-start gap-3">
          <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Only expense members can delete this expense.
          </p>
        </Card>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <DialogFooter className="mt-6 flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-lg"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading || !expenseId || !groupId}
            className="rounded-lg"
          >
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}