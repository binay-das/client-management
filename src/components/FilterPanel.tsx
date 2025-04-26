import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Check } from 'lucide-react';

interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: SortField[]) => void;
  currentFilters: SortField[];
}

export interface SortField {
  field: string;
  direction: 'asc' | 'desc';
}

const availableFields = [
  { field: 'name', label: 'Name' },
  { field: 'type', label: 'Type' },
  { field: 'email', label: 'Email' },
  { field: 'status', label: 'Status' },
  { field: 'createdAt', label: 'Created Date' },
  { field: 'updatedAt', label: 'Updated Date' },
];

export function FilterPanel({ open, onOpenChange, onApplyFilters, currentFilters }: FilterPanelProps) {
  const [filters, setFilters] = useState<SortField[]>(currentFilters);

  const toggleFilter = (field: string, direction: 'asc' | 'desc') => {
    setFilters(prev => {
      const existingFilter = prev.find(f => f.field === field);
      if (existingFilter) {
        if (existingFilter.direction === direction) {
          return prev.filter(f => f.field !== field);
        } else {
          return prev.map(f => 
            f.field === field ? { ...f, direction } : f
          );
        }
      } else {
        return [...prev, { field, direction }];
      }
    });
  };

  const isFilterActive = (field: string, direction: 'asc' | 'desc') => {
    return filters.some(f => f.field === field && f.direction === direction);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sort By</DialogTitle>
          <DialogDescription>
            Select the fields to sort by and their order.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 mt-4">
          {availableFields.map(({ field, label }) => (
            <div key={field} className="flex items-center justify-between p-2 border rounded-md">
              <span className="font-medium">{label}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center gap-1",
                    isFilterActive(field, 'asc') && "bg-primary/10 text-primary"
                  )}
                  onClick={() => toggleFilter(field, 'asc')}
                >
                  {isFilterActive(field, 'asc') ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                  A-Z
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center gap-1",
                    isFilterActive(field, 'desc') && "bg-primary/10 text-primary"
                  )}
                  onClick={() => toggleFilter(field, 'desc')}
                >
                  {isFilterActive(field, 'desc') ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  Z-A
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onApplyFilters(filters);
            onOpenChange(false);
          }}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 