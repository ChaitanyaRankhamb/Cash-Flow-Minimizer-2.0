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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';

type SplitType = 'equal' | 'exact' | 'percentage';

interface Member {
  id: string;
  name: string;
  initials: string;
}

const MOCK_GROUPS = [
  { id: '1', name: 'Summer Trip', members: ['Alice', 'Bob', 'Charlie', 'Diana'] },
  { id: '2', name: 'Apartment Rent', members: ['Alice', 'Bob'] },
  { id: '3', name: 'Dinner Club', members: ['Charlie', 'Diana', 'Eve'] },
];

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Johnson', initials: 'AJ' },
  { id: '2', name: 'Bob Smith', initials: 'BS' },
  { id: '3', name: 'Charlie Brown', initials: 'CB' },
  { id: '4', name: 'Diana Prince', initials: 'DP' },
  { id: '5', name: 'Eve Wilson', initials: 'EW' },
];

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense?: (expense: {
    name: string;
    group: string;
    paidBy: string;
    amount: number;
    yourShare: number;
    date: string;
    status: 'settled' | 'pending';
  }) => void;
}

export function AddExpenseModal({ open, onOpenChange, onAddExpense }: AddExpenseModalProps) {
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [paidBy, setPaidBy] = useState('1');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(['1', '2']);
  const [exactSplits, setExactSplits] = useState<Record<string, string>>({});
  const [percentageSplits, setPercentageSplits] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const getSelectedMemberNames = () =>
    MOCK_MEMBERS.filter((m) => selectedMembers.includes(m.id)).map((m) => m.name);

  const calculateSplits = () => {
    const numAmount = parseFloat(amount) || 0;
    const splits: Record<string, number> = {};

    if (splitType === 'equal') {
      const sharePerMember = numAmount / selectedMembers.length;
      selectedMembers.forEach((id) => {
        splits[id] = sharePerMember;
      });
    } else if (splitType === 'exact') {
      selectedMembers.forEach((id) => {
        splits[id] = parseFloat(exactSplits[id] || '0') || 0;
      });
    } else if (splitType === 'percentage') {
      selectedMembers.forEach((id) => {
        const percentage = parseFloat(percentageSplits[id] || '0') || 0;
        splits[id] = (percentage / 100) * numAmount;
      });
    }

    return splits;
  };

  const getTotalExact = () =>
    selectedMembers.reduce((sum, id) => sum + (parseFloat(exactSplits[id] || '0') || 0), 0);

  const getTotalPercentage = () =>
    selectedMembers.reduce((sum, id) => sum + (parseFloat(percentageSplits[id] || '0') || 0), 0);

  const isValidExact = Math.abs(getTotalExact() - (parseFloat(amount) || 0)) < 0.01;
  const isValidPercentage = Math.abs(getTotalPercentage() - 100) < 0.01;

  const isFormValid =
    expenseName &&
    amount &&
    parseFloat(amount) > 0 &&
    selectedGroup &&
    selectedMembers.length > 0 &&
    (splitType === 'equal' || (splitType === 'exact' && isValidExact) || (splitType === 'percentage' && isValidPercentage));

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Create new expense object
      const newExpense = {
        name: expenseName,
        group: MOCK_GROUPS.find((g) => g.id === selectedGroup)?.name || '',
        paidBy: MOCK_MEMBERS.find((m) => m.id === paidBy)?.name || '',
        amount: parseFloat(amount),
        yourShare: splits['1'] || 0,
        date: new Date().toISOString().split('T')[0],
        status: 'pending' as const,
      };

      // Call parent callback to add expense
      onAddExpense?.(newExpense);
      
      toast.success('Expense added successfully');
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setExpenseName('');
    setAmount('');
    setSelectedGroup('');
    setPaidBy('1');
    setSplitType('equal');
    setSelectedMembers(['1', '2']);
    setExactSplits({});
    setPercentageSplits({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const splits = calculateSplits();
  const yourShare = splits['1'] || 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Expense</DialogTitle>
          <DialogDescription>
            Create a new expense and split it among group members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Expense Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Expense Details</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Expense Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Dinner at restaurant"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="bg-secondary/50 border-border focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 bg-secondary/50 border-border focus-visible:ring-2 focus-visible:ring-ring"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Group *</Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="bg-secondary/50 border-border focus-visible:ring-2 focus-visible:ring-ring">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_GROUPS.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidBy">Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="bg-secondary/50 border-border focus-visible:ring-2 focus-visible:ring-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_MEMBERS.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Split Type Section */}
          <div className="space-y-4 border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-foreground">Split Type</h3>

            <div className="flex gap-2">
              {(['equal', 'exact', 'percentage'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSplitType(type)}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    splitType === type
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary/50 text-muted-foreground border border-border hover:bg-secondary/70'
                  }`}
                >
                  {type === 'equal' ? 'Equal' : type === 'exact' ? 'Exact' : 'Percentage'}
                </button>
              ))}
            </div>
          </div>

          {/* Member Selection */}
          <div className="space-y-3 border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-foreground">Members *</h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-border bg-secondary/50 hover:bg-secondary/70"
                >
                  <span className="text-muted-foreground">
                    {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 max-h-48">
                {MOCK_MEMBERS.map((member) => (
                  <DropdownMenuCheckboxItem
                    key={member.id}
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={() => handleMemberToggle(member.id)}
                  >
                    {member.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {getSelectedMemberNames().map((name) => (
                  <Badge key={name} variant="secondary" className="bg-secondary/50 border-border">
                    {name.split(' ')[0]}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Split Details Section */}
          <div className="space-y-4 border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-foreground">Split Breakdown</h3>

            {splitType === 'equal' && (
              <div className="space-y-2">
                {selectedMembers.map((memberId) => {
                  const member = MOCK_MEMBERS.find((m) => m.id === memberId);
                  const share = splits[memberId];
                  return (
                    <div key={memberId} className="flex justify-between text-sm p-2 bg-secondary/30 rounded-lg">
                      <span className="text-muted-foreground">{member?.name}</span>
                      <span className="font-semibold text-foreground">${share.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {splitType === 'exact' && (
              <div className="space-y-3">
                {selectedMembers.map((memberId) => {
                  const member = MOCK_MEMBERS.find((m) => m.id === memberId);
                  return (
                    <div key={memberId} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground min-w-fit">{member?.name}</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={exactSplits[memberId] || ''}
                          onChange={(e) =>
                            setExactSplits((prev) => ({ ...prev, [memberId]: e.target.value }))
                          }
                          className="pl-8 bg-secondary/50 border-border focus-visible:ring-2 focus-visible:ring-ring text-sm"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 px-3 py-2 bg-secondary/30 rounded-lg flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className={`font-semibold ${isValidExact ? 'text-success' : 'text-destructive'}`}>
                    ${getTotalExact().toFixed(2)}
                  </span>
                </div>
                {!isValidExact && parseFloat(amount) > 0 && (
                  <p className="text-xs text-destructive">
                    Total must equal ${parseFloat(amount).toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {splitType === 'percentage' && (
              <div className="space-y-3">
                {selectedMembers.map((memberId) => {
                  const member = MOCK_MEMBERS.find((m) => m.id === memberId);
                  const share = splits[memberId];
                  return (
                    <div key={memberId} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground min-w-fit">{member?.name}</span>
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          placeholder="0"
                          value={percentageSplits[memberId] || ''}
                          onChange={(e) =>
                            setPercentageSplits((prev) => ({ ...prev, [memberId]: e.target.value }))
                          }
                          className="bg-secondary/50 border-border focus-visible:ring-2 focus-visible:ring-ring text-sm"
                          step="1"
                          min="0"
                          max="100"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground min-w-fit">%</span>
                      <span className="text-sm font-medium text-foreground min-w-fit">${share.toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="pt-2 px-3 py-2 bg-secondary/30 rounded-lg flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className={`font-semibold ${isValidPercentage ? 'text-success' : 'text-destructive'}`}>
                    {getTotalPercentage().toFixed(1)}%
                  </span>
                </div>
                {!isValidPercentage && getTotalPercentage() > 0 && (
                  <p className="text-xs text-destructive">Percentages must add up to 100%</p>
                )}
              </div>
            )}
          </div>

          {/* Expense Summary */}
          <Card className="border border-border bg-muted/30 p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-semibold text-foreground">${(parseFloat(amount) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid By</span>
                <span className="font-medium text-foreground">
                  {MOCK_MEMBERS.find((m) => m.id === paidBy)?.name || 'You'}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Your Share</span>
                <span className="font-semibold text-destructive">${yourShare.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Adding...' : 'Add Expense'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
