import { Client } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const generateRandomDate = (startDate: Date = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) => {
  const end = new Date().getTime();
  const start = startDate.getTime();
  return new Date(start + Math.random() * (end - start)).toISOString();
};

// mock clients
export const generateMockClients = (count = 50): Client[] => {
  const clientTypes: Client['type'][] = ['Individual', 'Corporate', 'Non-profit', 'Government'];
  const statuses: Client['status'][] = ['Active', 'Inactive', 'Pending', 'Archived'];
  const updaters = ['John Smith', 'Jane Doe', 'Alex Johnson', 'Maria Garcia', 'Wei Chen'];
  
  const domainNames = ['example.com', 'acme.org', 'globex.net', 'bigcorp.io', 'startup.co'];
  
  return Array.from({ length: count }, (_, index) => {
    const id = `CL-${1000 + index}`;
    const type = clientTypes[Math.floor(Math.random() * clientTypes.length)];
    const isCompany = type !== 'Individual';
    
    let name = '';
    let email = '';
    
    if (isCompany) {
      const companyNames = [
        'Acme', 'Globex', 'Soylent', 'Initech', 'Umbrella', 
        'Stark', 'Wayne', 'Cyberdyne', 'Massive', 'Aperture'
      ];
      const companyTypes = [
        'Inc.', 'Corp.', 'LLC', 'Ltd.', 'Co.',
        'Industries', 'Enterprises', 'Systems', 'Solutions', 'Technologies'
      ];
      
      name = `${companyNames[Math.floor(Math.random() * companyNames.length)]} ${
        companyTypes[Math.floor(Math.random() * companyTypes.length)]
      }`;
      
      const domainName = domainNames[Math.floor(Math.random() * domainNames.length)];
      const emailPrefix = name.split(' ')[0].toLowerCase();
      email = `contact@${emailPrefix}.${domainName.split('.')[1]}`;
    } else {
      const firstNames = [
        'John', 'Jane', 'Michael', 'Emily', 'David',
        'Sarah', 'Robert', 'Maria', 'James', 'Jessica'
      ];
      const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
        'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'
      ];
      
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      name = `${firstName} ${lastName}`;
      
      const domain = domainNames[Math.floor(Math.random() * domainNames.length)];
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
    }
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const updatedBy = updaters[Math.floor(Math.random() * updaters.length)];
    
    // Generate timestamps: created first, updated later
    const createdAt = generateRandomDate();
    const updatedAt = generateRandomDate(new Date(createdAt));
    
    return {
      id,
      name,
      type,
      email,
      status,
      updatedBy,
      createdAt,
      updatedAt,
    };
  });
};

export const mockClients = generateMockClients();