import { ReactNode, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GripVertical } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Define the column definition type
export interface ColumnDef<T> {
  accessorKey: keyof T;
  header: string;
  cell: ({ row }: { row: { original: T } }) => ReactNode;
}

interface ClientTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}

interface SortableRowProps<T> {
  row: T;
  columns: ColumnDef<T>[];
  index: number;
}

function SortableRow<T>({ row, columns, index }: SortableRowProps<T>) {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: (row as any).id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
    backgroundColor: isDragging ? 'var(--background)' : undefined,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`transition-colors animate-in slide-in-from-left-5 duration-300 ${
        isDragging ? 'shadow-lg opacity-90' : ''
      }`}
      data-index={index}
    >
      <TableCell className="w-[40px] p-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:text-primary touch-none"
        >
          <GripVertical size={18} />
        </div>
      </TableCell>
      {columns.map((column) => (
        <TableCell key={column.accessorKey as string}>
          {column.cell({ row: { original: row } })}
        </TableCell>
      ))}
    </TableRow>
  );
}

export default function ClientTable<T>({ data, columns }: ClientTableProps<T>) {
  const [items, setItems] = useState(data);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => (item as any).id === active.id);
      const newIndex = items.findIndex((item) => (item as any).id === over.id);

      const newItems = [...items];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);

      setItems(newItems);
    }
  };

  return (
    <Card className="animate-in fade-in-50 duration-500 delay-200 translate-y-1 w-full">
      <ScrollArea className="overflow-auto rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[40px]" />
              {columns.map((column) => (
                <TableHead key={column.accessorKey as string}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <TableBody>
              {items.length > 0 ? (
                <SortableContext
                  items={items.map((item) => (item as any).id)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((row, index) => (
                    <SortableRow
                      key={(row as any).id}
                      row={row}
                      columns={columns}
                      index={index}
                    />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </DndContext>
        </Table>
      </ScrollArea>
    </Card>
  );
}