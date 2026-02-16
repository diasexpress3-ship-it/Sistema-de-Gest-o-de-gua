
import { User, UserRole, House, Leak, Reading, Invoice } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'A106',
    name: 'Vicente Dias (Admin)',
    email: 'admin@diasexpress.co.mz',
    phoneNumber: 'A106',
    role: UserRole.ADMIN,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Vicente+Dias&background=0F172A&color=fff'
  },
  {
    id: 'u2',
    name: 'João Leitor',
    email: 'joao@diasexpress.co.mz',
    phoneNumber: '840000001',
    role: UserRole.LEITOR,
    status: 'active'
  },
  {
    id: 'u3',
    name: 'Carlos Técnico',
    email: 'carlos@diasexpress.co.mz',
    phoneNumber: '840000002',
    role: UserRole.TECNICO,
    status: 'active'
  }
];

export const MOCK_HOUSES: House[] = [
  {
    id: 'A113',
    ownerName: 'Maria Santos',
    phoneNumber: '845551234',
    secondaryPhone: '821112222',
    reference: 'Próximo ao Salão da Dona Ana, Portão Azul',
    meterId: 'CNT-001',
    status: 'active',
    lastReading: 150,
    lastReadingDate: '2026-01-05',
    password: 'Welcome26'
  },
  {
    id: 'A106789',
    ownerName: 'José Malangatana',
    phoneNumber: '849990000',
    reference: 'Perto da Igreja Santa Isabel',
    meterId: 'CNT-002',
    status: 'active',
    lastReading: 320,
    lastReadingDate: '2026-01-10',
    password: 'password123'
  }
];

export const MOCK_LEAKS: Leak[] = [
  {
    id: 'L-001',
    type: 'public',
    location: 'Rua das Flores, esquina com Mercado Kampos',
    description: 'Ruptura na tubagem principal da estrada.',
    severity: 'high',
    status: 'reported',
    reporterId: 'A113',
    photos: ['https://picsum.photos/seed/leak1/400/300'],
    reportedAt: '2026-02-15T10:00:00Z'
  }
];

export const MOCK_READINGS: Reading[] = [
  {
    id: 'R-001',
    houseId: 'A113',
    previousValue: 130,
    currentValue: 150,
    consumption: 20,
    status: 'pending',
    date: '2026-01-05',
    readerId: 'u2'
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-001',
    houseId: 'A113',
    readingId: 'R-001',
    invoiceNumber: 'AM-202601-001',
    month: 'Janeiro',
    year: 2026,
    amount: 500,
    taxes: 85,
    total: 585,
    status: 'pending',
    dueDate: '2026-01-15'
  },
  {
    id: 'INV-002',
    houseId: 'A113',
    readingId: 'R-002',
    invoiceNumber: 'AM-202602-001',
    month: 'Fevereiro',
    year: 2026,
    amount: 600,
    taxes: 102,
    total: 702,
    status: 'pending',
    dueDate: '2026-02-15'
  }
];

export const LANDMARKS = [
  { value: 'salao_ana', label: 'Salão da Dona Ana' },
  { value: 'padaria_central', label: 'Padaria Central' },
  { value: 'igreja_santa', label: 'Igreja Santa Isabel' },
  { value: 'mercado_kampos', label: 'Mercado Kampos' }
];
