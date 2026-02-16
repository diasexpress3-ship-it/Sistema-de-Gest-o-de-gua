
export enum UserRole {
  ADMIN = 'ADMIN',
  LEITOR = 'LEITOR',
  TECNICO = 'TECNICO',
  CLIENTE = 'CLIENTE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin?: string;
  avatar?: string;
  password?: string;
}

export interface House {
  id: string; // Ex: A10612345
  ownerName: string;
  phoneNumber: string;
  secondaryPhone?: string;
  reference: string;
  meterId: string;
  status: 'active' | 'inactive';
  lastReading?: number;
  lastReadingDate?: string;
  password?: string;
}

export interface Reading {
  id: string;
  houseId: string;
  previousValue: number;
  currentValue: number;
  consumption: number;
  photoUrl?: string;
  status: 'pending' | 'validated';
  date: string;
  readerId: string;
}

export interface Invoice {
  id: string;
  houseId: string;
  readingId: string;
  invoiceNumber: string;
  month: string;
  year: number;
  amount: number;
  taxes: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  pdfUrl?: string;
}

export interface Leak {
  id: string;
  houseId?: string;
  reporterId: string;
  type: 'residential' | 'public';
  location: string;
  latitude?: number;
  longitude?: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  photos: string[];
  status: 'reported' | 'assigned' | 'in_progress' | 'resolved';
  technicianId?: string;
  reportedAt: string;
}
