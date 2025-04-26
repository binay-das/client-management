import { ColumnDef } from '@/components/ClientTable';
import { Client } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

//status-colors
const StatusBadge = ({ status }: { status: Client['status'] }) => {
  const getVariant = () => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'secondary';
      case 'Pending':
        return 'outline';
      case 'Archived':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return <Badge variant={getVariant()}>{status}</Badge>;
};

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: 'id',
    header: 'Client ID',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.original.id}</div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Client Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Client Type',
    cell: ({ row }) => row.original.type,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.original.email}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'updatedBy',
    header: 'Updated By',
    cell: ({ row }) => row.original.updatedBy,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => formatDate(row.original.updatedAt),
  },
];