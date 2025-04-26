import { useMemo, useState } from 'react';
import { Client, ClientType } from '@/types';

export const useFilteredData = (data: Client[]) => {
  const [activeFilter, setActiveFilter] = useState<ClientType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(client => {
      // Apply type filter
      if (activeFilter !== 'all' && client.type !== activeFilter) {
        return false;
      }

      // Apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          client.name.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.id.toLowerCase().includes(searchLower) ||
          client.type.toLowerCase().includes(searchLower) ||
          client.status.toLowerCase().includes(searchLower) ||
          client.updatedBy.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [data, activeFilter, searchQuery]);

  return {
    filteredData,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery
  };
};