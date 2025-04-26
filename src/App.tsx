import { clientColumns } from '@/components/Columns';
import ClientTable from './components/ClientTable';
import { mockClients } from '@/data/clients';
import { useSortableData } from '@/hooks/useSortableData';

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
    <>
      <ClientTable data={sortedData} columns={clientColumns} />
    </>
  )
}

export default App
