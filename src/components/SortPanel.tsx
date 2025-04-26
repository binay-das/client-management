import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Client, SortField } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SortPanelProps {
  sortFields: SortField[];
  onRemoveSortField: (id: string) => void;
  onToggleSortDirection: (id: string) => void;
  onUpdateSortFields: (fields: SortField[]) => void;
  onAddSortField: (field: keyof Client) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableSortFields: { value: keyof Client; label: string }[] = [
  { value: 'id', label: 'Client ID' },
  { value: 'name', label: 'Client Name' },
  { value: 'type', label: 'Client Type' },
  { value: 'email', label: 'Email' },
  { value: 'status', label: 'Status' },
  { value: 'updatedBy', label: 'Updated By' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' }
];

export function SortPanel({
  sortFields,
  onRemoveSortField,
  onToggleSortDirection,
  onUpdateSortFields,
  onAddSortField,
  open,
  onOpenChange
}: SortPanelProps) {
  const [selectedField, setSelectedField] = useState<keyof Client | ''>('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sortFields.findIndex((field) => field.id === active.id);
      const newIndex = sortFields.findIndex((field) => field.id === over.id);
      
      const newSortFields = arrayMove(sortFields, oldIndex, newIndex);
      onUpdateSortFields(newSortFields);
    }
  };

  const handleAddSort = () => {
    if (selectedField) {
      onAddSortField(selectedField as keyof Client);
      setSelectedField('');
    }
  };

  // Filter out fields that are already in the sort list
  const availableFields = availableSortFields.filter(
    (field) => !sortFields.some((sortField) => sortField.field === field.value)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sort Clients</DialogTitle>
          <DialogDescription>
            Add and arrange sort criteria to organize your client list.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 mt-4">
          {sortFields.length > 0 ? (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={sortFields.map(field => field.id)} 
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2 mb-4">
                  {sortFields.map((field) => (
                    <SortableItem
                      key={field.id}
                      sortField={field}
                      onToggleDirection={onToggleSortDirection}
                      onRemove={onRemoveSortField}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No sort fields applied. Add one below.
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Select
              value={selectedField}
              onValueChange={(value) => setSelectedField(value as keyof Client)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select field to sort by" />
              </SelectTrigger>
              <SelectContent>
                {availableFields.length > 0 ? (
                  availableFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    All fields already added
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <Button
              onClick={handleAddSort}
              disabled={!selectedField || availableFields.length === 0}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              <span>Add</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}