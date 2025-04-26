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

function App() {
  const [sortPanelOpen, setSortPanelOpen] = useState(false);
  
  const {
    sortedData,
    sortConfig,
    addSortField,
    removeSortField,
    toggleSortDirection,
    updateSortFieldsOrder
  } = useSortableData(mockClients);

  const {
    filteredData,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery
  } = useFilteredData(sortedData);
  return (
    <ThemeProvider defaultTheme="system">
      <div className="lg:w-[90%] w-screen min-h-screen flex flex-col items-center justify-center mx-auto bg-background">
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
