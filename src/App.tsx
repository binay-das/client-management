import { clientColumns } from '@/components/Columns';
import ClientTable from './components/ClientTable';
import { mockClients } from '@/data/clients';
import { useSortableData } from '@/hooks/useSortableData';
import ThemeToggle from './components/theme/ThemeToggle';
import ThemeProvider from './components/theme/ThemeProvider';

function App() {
  const {
    sortedData,
    sortConfig,
    addSortField,
    removeSortField,
    toggleSortDirection,
    updateSortFieldsOrder
  } = useSortableData(mockClients);
  return (
    <ThemeProvider defaultTheme='system'>
    <ThemeToggle />
      <ClientTable data={sortedData} columns={clientColumns} />
    </ThemeProvider>
  )
}

export default App
