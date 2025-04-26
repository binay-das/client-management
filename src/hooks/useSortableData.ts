import { useEffect, useState } from 'react';
import { SortField } from '@/types';
// import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'client_sort_order';

export function useSortableData<T extends Record<string, any>>(items: T[]) {
  const [sortConfig, setSortConfig] = useState<{
    sortFields: SortField[];
  }>({ sortFields: [] });

  // Load order from localStorage
  useEffect(() => {
    const savedSortOrder = localStorage.getItem(STORAGE_KEY);
    if (savedSortOrder) {
      try {
        const parsedSortOrder = JSON.parse(savedSortOrder);
        setSortConfig({ sortFields: parsedSortOrder });
      } catch (error) {
        console.error('Failed to parse saved sort order:', error);
      }
    }
  }, []);

  // Save order to localStorage 
  useEffect(() => {
    if (sortConfig.sortFields.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sortConfig.sortFields));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [sortConfig.sortFields]);

  const addSortField = (field: keyof T) => {
    setSortConfig(prev => ({
      sortFields: [
        ...prev.sortFields,
        {
          id: `sort-${Date.now()}`,
          field: field as string,
          direction: 'asc' as const
        } as SortField
      ]
    }));
  };

  const removeSortField = (id: string) => {
    setSortConfig(prev => ({
      sortFields: prev.sortFields.filter(field => field.id !== id)
    }));
  };

  const toggleSortDirection = (id: string) => {
    setSortConfig(prev => ({
      sortFields: prev.sortFields.map(field =>
        field.id === id
          ? { ...field, direction: field.direction === 'asc' ? 'desc' : 'asc' }
          : field
      )
    }));
  };

  const updateSortFieldsOrder = (newSortFields: SortField[]) => {
    setSortConfig({ sortFields: newSortFields });
  };

  const sortedData = [...items].sort((a, b) => {
    for (const { field, direction } of sortConfig.sortFields) {
      const aValue = a[field as keyof T];
      const bValue = b[field as keyof T];

      if (aValue === bValue) continue;

      const comparison = aValue < bValue ? -1 : 1;
      return direction === 'asc' ? comparison : -comparison;
    }
    return 0;
  });

  return {
    sortedData,
    sortConfig,
    addSortField,
    removeSortField,
    toggleSortDirection,
    updateSortFieldsOrder
  };
}