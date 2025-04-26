export type ClientType = 'Individual' | 'Corporate' | 'Non-profit' | 'Government';

export type ClientStatus = 'Active' | 'Inactive' | 'Pending' | 'Archived';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  email: string;
  status: ClientStatus;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type SortField = {
  id: string;
  field: keyof Client;
  direction: 'asc' | 'desc';
};

export type SortConfig = {
  sortFields: SortField[];
};