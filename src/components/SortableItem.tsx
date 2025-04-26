import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, X, GripVertical } from 'lucide-react';
import { SortField } from '@/types';
import { cn } from '@/lib/utils';

interface SortableItemProps {
  sortField: SortField;
  onToggleDirection: (id: string) => void;
  onRemove: (id: string) => void;
}

export function SortableItem({ sortField, onToggleDirection, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: sortField.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  // Format field name for display (convert camelCase to Title Case)
  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center justify-between p-2 border rounded-md bg-background',
        'transition-all duration-200 ease-in-out',
        isDragging && 'shadow-lg opacity-80 border-primary'
      )}
    >
      <div className="flex items-center gap-2" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{formatFieldName(sortField.field)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleDirection(sortField.id)}
          className="flex items-center gap-1"
        >
          {sortField.direction === 'asc' ? 'A-Z' : 'Z-A'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(sortField.id)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
}