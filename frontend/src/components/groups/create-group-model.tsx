'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreate?: (groupData: { name: string; description: string }) => void;
}

export function CreateGroupModal({
  open,
  onOpenChange,
  onGroupCreate,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onGroupCreate?.({ name: groupName, description });
      toast.success('Group created successfully');
      setGroupName('');
      setDescription('');
      setIsLoading(false);
      onOpenChange(false);
    }, 600);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setGroupName('');
      setDescription('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-md gap-6 rounded-2xl border-border bg-card p-6 shadow-xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <DialogTitle className="text-xl font-bold text-foreground">
              Create New Group
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Start tracking shared expenses with your friends or team
            </DialogDescription>
          </div>
          {/* <button
            onClick={() => handleOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button> */}
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="group-name" className="text-sm font-medium text-foreground">
              Group Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="group-name"
              type="text"
              placeholder="Trip to Goa, Flat Expenses, etc."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="rounded-lg border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              disabled={isLoading}
            />
            {!groupName.trim() && groupName !== '' && (
              <p className="text-xs text-destructive font-medium">Group name is required</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Description <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Short description about this group…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg border-border bg-background/50 px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              rows={4}
              disabled={isLoading}
            />
          </div>

          {/* Admin Note */}
          <Card className="p-3 bg-muted/40 border-border/50 flex items-start gap-3">
            <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              You will be the admin of this group by default.
            </p>
          </Card>
        </div>

        {/* Footer Buttons */}
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
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground"></div>
                Creating…
              </div>
            ) : (
              'Create Group'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
