// Organization structure types

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  hiringManagerIds: string[]; // IDs of hiring managers assigned to this location
  departmentIds: string[]; // IDs of departments in this location
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  locationId: string; // ID of the location this department belongs to
  teamLeadId: string | null; // ID of the team lead (can be null)
  memberCount: number; // Number of team members
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentId: string;
  avatar?: string;
  hireDate: string;
  skills: string[];
  status: 'active' | 'inactive';
}

// Mock data for locations
export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    name: 'Miami Headquarters',
    address: '123 Ocean Drive',
    city: 'Miami',
    state: 'FL',
    zipCode: '33139',
    country: 'USA',
    hiringManagerIds: ['user-2', 'user-6'],
    departmentIds: ['dept-1', 'dept-2', 'dept-3'],
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-06-10T00:00:00Z'
  },
  {
    id: 'loc-2',
    name: 'New York Office',
    address: '456 Broadway',
    city: 'New York',
    state: 'NY',
    zipCode: '10013',
    country: 'USA',
    hiringManagerIds: ['user-7'],
    departmentIds: ['dept-4', 'dept-5'],
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z'
  },
  {
    id: 'loc-3',
    name: 'San Francisco Branch',
    address: '789 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    country: 'USA',
    hiringManagerIds: ['user-8'],
    departmentIds: ['dept-6'],
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-06-20T00:00:00Z'
  }
];

// Mock data for departments
export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'IT Department',
    description: 'Responsible for all technology infrastructure and software development',
    locationId: 'loc-1', // Miami
    teamLeadId: 'user-10',
    memberCount: 12,
    createdAt: '2023-01-20T00:00:00Z',
    updatedAt: '2023-06-12T00:00:00Z'
  },
  {
    id: 'dept-2',
    name: 'Marketing',
    description: 'Handles all marketing, advertising, and brand management',
    locationId: 'loc-1', // Miami
    teamLeadId: 'user-11',
    memberCount: 8,
    createdAt: '2023-01-25T00:00:00Z',
    updatedAt: '2023-06-14T00:00:00Z'
  },
  {
    id: 'dept-3',
    name: 'Human Resources',
    description: 'Manages recruitment, employee relations, and benefits',
    locationId: 'loc-1', // Miami
    teamLeadId: 'user-12',
    memberCount: 5,
    createdAt: '2023-01-30T00:00:00Z',
    updatedAt: '2023-06-16T00:00:00Z'
  },
  {
    id: 'dept-4',
    name: 'Finance',
    description: 'Handles accounting, financial planning, and analysis',
    locationId: 'loc-2', // New York
    teamLeadId: 'user-13',
    memberCount: 7,
    createdAt: '2023-02-25T00:00:00Z',
    updatedAt: '2023-06-18T00:00:00Z'
  },
  {
    id: 'dept-5',
    name: 'Sales',
    description: 'Responsible for client acquisition and relationship management',
    locationId: 'loc-2', // New York
    teamLeadId: 'user-14',
    memberCount: 10,
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-06-20T00:00:00Z'
  },
  {
    id: 'dept-6',
    name: 'Product Development',
    description: 'Focuses on product strategy, design, and innovation',
    locationId: 'loc-3', // San Francisco
    teamLeadId: 'user-15',
    memberCount: 9,
    createdAt: '2023-03-15T00:00:00Z',
    updatedAt: '2023-06-22T00:00:00Z'
  }
];

// Mock data for team members
export const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-10',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'IT Director',
    departmentId: 'dept-1',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-06-15',
    skills: ['Project Management', 'IT Strategy', 'Team Leadership'],
    status: 'active'
  },
  {
    id: 'user-11',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'Marketing Director',
    departmentId: 'dept-2',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-07-10',
    skills: ['Digital Marketing', 'Brand Strategy', 'Content Creation'],
    status: 'active'
  },
  {
    id: 'user-12',
    name: 'Michael Torres',
    email: 'michael.torres@example.com',
    role: 'HR Manager',
    departmentId: 'dept-3',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-08-05',
    skills: ['Recruitment', 'Employee Relations', 'Benefits Administration'],
    status: 'active'
  },
  {
    id: 'user-13',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    role: 'Finance Director',
    departmentId: 'dept-4',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-09-12',
    skills: ['Financial Analysis', 'Budgeting', 'Strategic Planning'],
    status: 'active'
  },
  {
    id: 'user-14',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Sales Director',
    departmentId: 'dept-5',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-10-20',
    skills: ['Client Acquisition', 'Relationship Management', 'Sales Strategy'],
    status: 'active'
  },
  {
    id: 'user-15',
    name: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    role: 'Product Director',
    departmentId: 'dept-6',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-11-15',
    skills: ['Product Strategy', 'UX Design', 'Agile Methodology'],
    status: 'active'
  }
];

// Helper function to get departments by location ID
export const getDepartmentsByLocationId = (locationId: string): Department[] => {
  return mockDepartments.filter(dept => dept.locationId === locationId);
};

// Helper function to get team members by department ID
export const getTeamMembersByDepartmentId = (departmentId: string): TeamMember[] => {
  return mockTeamMembers.filter(member => member.departmentId === departmentId);
};

// Helper function to get team lead by department ID
export const getTeamLeadByDepartmentId = (departmentId: string): TeamMember | undefined => {
  const department = mockDepartments.find(dept => dept.id === departmentId);
  if (!department || !department.teamLeadId) return undefined;
  
  return mockTeamMembers.find(member => member.id === department.teamLeadId);
};

// Helper function to get location by ID
export const getLocationById = (locationId: string): Location | undefined => {
  return mockLocations.find(location => location.id === locationId);
};

// Helper function to get department by ID
export const getDepartmentById = (departmentId: string): Department | undefined => {
  return mockDepartments.find(department => department.id === departmentId);
};
