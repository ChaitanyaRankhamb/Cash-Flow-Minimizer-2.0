'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SettleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settlementId: string | null;
  from: {
    name: string;
    avatar?: string;
    initials: string;
  } | null;
  to: {
    name: string;
    avatar?: string;
    initials: string;
  } | null;
  amount: number;
  group: string;
  onConfirm?: (settlementId: string, paymentMethod: string) => Promise<void>;
}

export function SettleModal({
  open,
  onOpenChange,
  settlementId,
  from,
  to,
  amount,
  group,
  onConfirm,
}: SettleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleConfirm = async () => {
    if (!settlementId) return;
    setIsLoading(true);
    try {
      await onConfirm?.(settlementId, paymentMethod);
      toast.success('Settlement completed successfully');
      onOpenChange(false);
      setPaymentMethod('cash');
    } catch (error) {
      toast.error('Failed to settle transaction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border rounded-2xl shadow-xl backdrop-blur-xl max-w-md" aria-describedby="settle-description">
        <DialogHeader>
          <DialogTitle className="text-xl">Confirm Settlement</DialogTitle>
          <DialogDescription id="settle-description">
            Mark this transaction as settled. Choose your payment method below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={from?.avatar} alt={from?.name} />
                  <AvatarFallback className="text-xs">{from?.initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{from?.name}</span>
              </div>
              <span className="text-lg font-bold text-foreground">${amount.toFixed(2)}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{to?.name}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={to?.avatar} alt={to?.name} />
                  <AvatarFallback className="text-xs">{to?.initials}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>Group: <span className="text-foreground font-medium">{group}</span></p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Payment Method</label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="border border-border bg-secondary/30 focus-visible:ring-2 focus-visible:ring-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Settling...' : 'Confirm Settlement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
