import { Search, SortAsc, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClientType } from '@/types';
import { cn } from '@/lib/utils';

interface TableToolbarProps {
  activeFilter: ClientType | 'all';
  onFilterChange: (filter: ClientType | 'all') => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onSortClick: () => void;
}

const filterButtons: { value: ClientType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Government', label: 'Govt' },
  { value: 'Non-profit', label: 'Non-profit' },
  { value: 'Individual', label: 'Individual' },
];

export function TableToolbar({
  activeFilter,
  onFilterChange,
  onSearchChange,
  searchQuery,
  onSortClick,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 w-full">
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ value, label }) => (
          <Button
            key={value}
            variant={activeFilter === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(value)}
            className={cn(
              'transition-colors',
              activeFilter === value && 'bg-primary text-primary-foreground'
            )}
          >
            {label}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 w-full sm:w-[250px]"
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onSortClick}
          className="shrink-0"
        >
          <SortAsc className="h-4 w-4" />
          <span className="sr-only">Sort</span>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
        >
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
        
        <Button size="sm" className="shrink-0">
          Add Client
        </Button>
      </div>
    </div>
  );
}