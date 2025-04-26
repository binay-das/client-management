import { ReactNode } from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

function ClientTable<T>({ data, columns }: ClientTableProps<T>) {
  return (
    <div>
      <Card className="animate-in fade-in-50 duration-500 delay-200 translate-y-1">
        <ScrollArea>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.accessorKey as string}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex}
                  className="transition-colors animate-in slide-in-from-left-5 duration-300"
                  style={{ 
                    animationDelay: `${rowIndex * 20}ms`,
                    animationFillMode: 'backwards'
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey as string}>
                      {column.cell({ row: { original: row } })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ClientTable;

interface ClientTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}

export interface ColumnDef<T> {
  accessorKey: keyof T;
  header: string;
  cell: ({ row }: { row: { original: T } }) => ReactNode;
}
