'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName?: string;
  onMemberAdd?: (email: string) => void;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getInitials = (email: string): string => {
  const [localPart] = email.split('@');
  const parts = localPart.split('.');
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return localPart.substring(0, 2).toUpperCase();
};

export function AddMemberModal({
  open,
  onOpenChange,
  groupName,
  onMemberAdd,
}: AddMemberModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const valid = isValidEmail(email);
    setIsValid(valid);
    
    // Simulate checking if user exists
    if (valid) {
      setUserExists(Math.random() > 0.5);
    }
  }, [email]);

  const handleAddMember = async () => {
    if (!isValid) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onMemberAdd?.(email);
      toast.success('Member added successfully');
      setEmail('');
      setIsLoading(false);
      onOpenChange(false);
    }, 600);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEmail('');
    }
    onOpenChange(newOpen);
  };

  const showPreview = isValid && email;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-md gap-6 rounded-2xl border-border bg-card p-6 shadow-xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <DialogTitle className="text-xl font-bold text-foreground">
              Add Member
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Invite someone to {groupName ? `"${groupName}"` : 'this group'} using their email
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
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="member-email" className="text-sm font-medium text-foreground">
              Member Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="member-email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`rounded-lg border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:transition-all ${
                email && isValid
                  ? 'focus:ring-2 focus:ring-success/30 focus:border-success border-success/50'
                  : email && !isValid
                  ? 'focus:ring-2 focus:ring-destructive/30 focus:border-destructive border-destructive/50'
                  : 'focus:ring-2 focus:ring-primary/30 focus:border-primary'
              }`}
              disabled={isLoading}
            />
            {email && !isValid && (
              <p className="text-xs text-destructive font-medium">Invalid email address</p>
            )}
            {email && isValid && (
              <p className="text-xs text-success font-medium flex items-center gap-1">
                <Check className="h-3 w-3" /> Valid email
              </p>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              They will receive an invitation to join this group.
            </p>
          </div>

          {/* User Preview Card */}
          {showPreview && isValid && (
            <Card className="p-4 bg-secondary/30 border-border/50 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-primary/10">
                  <AvatarFallback className="bg-primary/15 text-primary font-semibold text-sm">
                    {getInitials(email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{email}</p>
                  <p className="text-xs text-muted-foreground">
                    {userExists ? 'User Found' : 'Will be invited'}
                  </p>
                </div>
                <Badge className={userExists ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}>
                  {userExists ? 'Found' : 'New'}
                </Badge>
              </div>
            </Card>
          )}
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
            onClick={handleAddMember}
            disabled={!isValid || isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground"></div>
                Adding…
              </div>
            ) : (
              'Add Member'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
