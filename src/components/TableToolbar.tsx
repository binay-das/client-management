import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterPanel } from './FilterPanel';
import { Plus, Search, ArrowUpDown } from 'lucide-react';
import { ClientType } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface TableToolbarProps {
  activeFilter: ClientType | 'all';
  onFilterChange: (filter: ClientType | 'all') => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onSortClick: () => void;
  onAddClient: (client: {
    name: string;
    type: ClientType;
    email: string;
    status: 'Active' | 'Inactive' | 'Pending' | 'Archived';
  }) => void;
  onApplySortFilters: (filters: { field: string; direction: 'asc' | 'desc' }[]) => void;
  currentSortFilters: { field: string; direction: 'asc' | 'desc' }[];
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
  onAddClient,
  onApplySortFilters,
  currentSortFilters,
}: TableToolbarProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    type: 'Individual' as ClientType,
    email: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Pending' | 'Archived',
  });

  const handleAddClient = () => {
    if (newClient.name && newClient.email) {
      onAddClient(newClient);
      setNewClient({
        name: '',
        type: 'Individual',
        email: '',
        status: 'Active',
      });
      setIsAddDialogOpen(false);
    }
  };

  return (
    <>
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
          
          {/* <Button
            variant="outline"
            size="icon"
            onClick={onSortClick}
            className="shrink-0"
          >
            <SortAsc className="h-4 w-4" />
            <span className="sr-only">Sort</span>
          </Button> */}
          
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "shrink-0",
              currentSortFilters.length > 0 && "bg-primary/10 text-primary"
            )}
            onClick={() => setIsFilterPanelOpen(true)}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          
          <Button 
            size="sm" 
            className="shrink-0"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      <FilterPanel
        open={isFilterPanelOpen}
        onOpenChange={setIsFilterPanelOpen}
        onApplyFilters={onApplySortFilters}
        currentFilters={currentSortFilters}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new client to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={newClient.type}
                onValueChange={(value) => setNewClient({ ...newClient, type: value as ClientType })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  {['Individual', 'Corporate', 'Non-profit', 'Government'].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newClient.status}
                onValueChange={(value) => setNewClient({ ...newClient, status: value as typeof newClient.status })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {['Active', 'Inactive', 'Pending', 'Archived'].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddClient}
              disabled={!newClient.name || !newClient.email}
            >
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}