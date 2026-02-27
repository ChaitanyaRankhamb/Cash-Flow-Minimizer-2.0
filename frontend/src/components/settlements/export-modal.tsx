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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport?: (format: 'csv' | 'pdf') => Promise<void>;
}

export function ExportModal({ open, onOpenChange, onExport }: ExportModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');

  const handleExport = async () => {
    setIsLoading(true);
    try {
      await onExport?.(format);
      toast.success(`Settlement report exported as ${format.toUpperCase()}`);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border rounded-2xl shadow-xl backdrop-blur-xl max-w-md" aria-describedby="export-description">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Settlement Report
          </DialogTitle>
          <DialogDescription id="export-description">
            Choose a format to export your settlement report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={format} onValueChange={(v) => setFormat(v as 'csv' | 'pdf')}>
            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-secondary/30 cursor-pointer transition-colors">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="cursor-pointer flex-1 font-medium">
                CSV Format
              </Label>
              <span className="text-xs text-muted-foreground">Excel compatible</span>
            </div>
            <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-secondary/30 cursor-pointer transition-colors">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="cursor-pointer flex-1 font-medium">
                PDF Format
              </Label>
              <span className="text-xs text-muted-foreground">Printable</span>
            </div>
          </RadioGroup>
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
            onClick={handleExport}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
