import { useCallback, useEffect, useMemo, useState } from 'react';
import { Client, SortConfig, SortField } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'client-sort-config';

export const useSortableData = (data: Client[]) => {
  // Load sort config from localStorage or use default
  const loadSavedConfig = (): SortConfig => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        return JSON.parse(savedConfig);
      }
    } catch (error) {
      console.error('Error loading sort config from localStorage:', error);
    }

    return {
      sortFields: [
        {
          id: uuidv4(),
          field: 'name',
          direction: 'asc'
        }
      ]
    };
  };

  const [sortConfig, setSortConfig] = useState<SortConfig>(loadSavedConfig);

  //saving sort config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sortConfig));
    } catch (error) {
      console.error('Error saving sort config to localStorage:', error);
    }
  }, [sortConfig]);

  const addSortField = useCallback((field: keyof Client) => {
    setSortConfig((prevConfig) => ({
      ...prevConfig,
      sortFields: [
        ...prevConfig.sortFields,
        {
          id: uuidv4(),
          field,
          direction: 'asc'
        }
      ]
    }));
  }, []);

  const removeSortField = useCallback((id: string) => {
    setSortConfig((prevConfig) => ({
      ...prevConfig,
      sortFields: prevConfig.sortFields.filter((field) => field.id !== id)
    }));
  }, []);

  const toggleSortDirection = useCallback((id: string) => {
    setSortConfig((prevConfig) => ({
      ...prevConfig,
      sortFields: prevConfig.sortFields.map((field) => 
        field.id === id 
          ? { ...field, direction: field.direction === 'asc' ? 'desc' : 'asc' } 
          : field
      )
    }));
  }, []);

  // Update order on drag-and-drop
  const updateSortFieldsOrder = useCallback((newOrder: SortField[]) => {
    setSortConfig((prevConfig) => ({
      ...prevConfig,
      sortFields: newOrder
    }));
  }, []);

  const sortedData = useMemo(() => {
    if (sortConfig.sortFields.length === 0) {
      return [...data];
    }

    return [...data].sort((a, b) => {
      for (const sortField of sortConfig.sortFields) {
        const { field, direction } = sortField;
        
        const valueA = a[field];
        const valueB = b[field];
        
        if (valueA === valueB) continue;

        const compareA = typeof valueA === 'string' ? valueA.toLowerCase() : valueA;
        const compareB = typeof valueB === 'string' ? valueB.toLowerCase() : valueB;
        
        if (direction === 'asc') {
          if (compareA < compareB) return -1;
          if (compareA > compareB) return 1;
        } else {
          if (compareA < compareB) return 1;
          if (compareA > compareB) return -1;
        }
      }
      
      return 0;
    });
  }, [data, sortConfig]);

  return {
    sortedData,
    sortConfig,
    addSortField,
    removeSortField,
    toggleSortDirection,
    updateSortFieldsOrder
  };
};