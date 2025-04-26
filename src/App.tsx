import { clientColumns } from "@/components/Columns";
import ClientTable from "./components/ClientTable";
import { mockClients } from "@/data/clients";
import { useSortableData } from "@/hooks/useSortableData";
import ThemeToggle from "./components/theme/ThemeToggle";
import ThemeProvider from "./components/theme/ThemeProvider";
import { UsersRound } from "lucide-react";
import { SortPanel } from "./components/SortPanel";
import { TableToolbar } from "./components/TableToolbar";
import { useFilteredData } from "./hooks/useFilteredData";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { SortField } from './components/FilterPanel';

function App() {
  const [sortPanelOpen, setSortPanelOpen] = useState(false);
  const [clients, setClients] = useState(mockClients);
  const [sortFilters, setSortFilters] = useState<SortField[]>([]);
  
  const {
    sortedData,
    sortConfig,
    addSortField,
    removeSortField,
    toggleSortDirection,
    updateSortFieldsOrder
  } = useSortableData(clients);

  const {
    filteredData,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery
  } = useFilteredData(sortedData);

  const handleAddClient = (newClient: {
    name: string;
    type: 'Individual' | 'Corporate' | 'Non-profit' | 'Government';
    email: string;
    status: 'Active' | 'Inactive' | 'Pending' | 'Archived';
  }) => {
    const client = {
      ...newClient,
      id: `CL-${1000 + clients.length}`,
      updatedBy: 'System',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setClients(prevClients => [...prevClients, client]);
  };

  const handleApplySortFilters = (filters: SortField[]) => {
    setSortFilters(filters);
    // Convert filters to sortConfig format
    const newSortConfig = {
      sortFields: filters.map(filter => ({
        id: uuidv4(),
        field: filter.field as keyof typeof clients[0],
        direction: filter.direction
      }))
    };
    updateSortFieldsOrder(newSortConfig.sortFields);
  };

  return (
    <ThemeProvider defaultTheme="system">
      <div className="w-[90%] min-h-screen flex flex-col items-center mx-auto bg-background">
        <header className="w-full mx-auto p-4 lg:my-2 flex justify-between items-center">
          <div className="flex items-center justify-center gap-4">
            <UsersRound size={32} absoluteStrokeWidth />
            <h1 className="text-3xl font-bold">Client Management</h1>
          </div>
          <ThemeToggle />
        </header>

        <TableToolbar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSortClick={() => setSortPanelOpen(true)}
          onAddClient={handleAddClient}
          onApplySortFilters={handleApplySortFilters}
          currentSortFilters={sortFilters}
        />
        
        <SortPanel
          sortFields={sortConfig.sortFields}
          onRemoveSortField={removeSortField}
          onToggleSortDirection={toggleSortDirection}
          onUpdateSortFields={updateSortFieldsOrder}
          onAddSortField={addSortField}
          open={sortPanelOpen}
          onOpenChange={setSortPanelOpen}
        />

        <ClientTable data={filteredData} columns={clientColumns} />
      </div>
    </ThemeProvider>
  );
}

export default App;
