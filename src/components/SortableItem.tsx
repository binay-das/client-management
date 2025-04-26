import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ArrowUp, ArrowDown, X } from 'lucide-react';
import { SortField } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
  } = useSortable({
    id: sortField.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1
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
        'flex items-center gap-2 px-3 py-2 bg-card rounded-md border',
        'transition-all duration-200 ease-in-out',
        isDragging && 'shadow-lg opacity-80 border-primary'
      )}
      {...attributes}
    >
      <div
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:text-primary touch-none"
      >
        <GripVertical size={18} />
      </div>
      
      <div className="flex-1 font-medium">
        {formatFieldName(sortField.field)}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleDirection(sortField.id)}
        className="group"
      >
        <span className="sr-only">Toggle sort direction</span>
        
        {sortField.direction === 'asc' ? (
          <ArrowUp
            size={18}
            className="text-primary transition-transform group-hover:scale-110"
          />
        ) : (
          <ArrowDown
            size={18}
            className="text-primary transition-transform group-hover:scale-110"
          />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(sortField.id)}
        className="text-muted-foreground hover:text-destructive transition-colors"
      >
        <span className="sr-only">Remove sort field</span>
        <X size={16} />
      </Button>
    </div>
  );
}