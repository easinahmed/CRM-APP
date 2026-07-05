export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales' | 'support';
  avatar: string;
  department?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    emailNotifications: boolean;
  };
  createdAt: string;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: 'active' | 'inactive' | 'lead' | 'churned';
  source: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  tags: string[];
  notes: string;
  assignedTo?: Pick<User, '_id' | 'name' | 'email' | 'avatar'>;
  createdBy: Pick<User, '_id' | 'name'>;
  lastContacted?: string;
  leadScore: number;
  lifetimeValue: number;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  source: string;
  priority: 'low' | 'medium' | 'high';
  pipelineStage: string;
  pipelinePosition: number;
  estimatedValue: number;
  probability: number;
  notes: string;
  tags: string[];
  assignedTo?: Pick<User, '_id' | 'name' | 'email' | 'avatar'>;
  createdBy: Pick<User, '_id' | 'name'>;
  convertedToCustomer?: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  completedAt?: string;
  relatedTo: {
    type: string;
    id: string;
  };
  assignedTo?: Pick<User, '_id' | 'name' | 'email' | 'avatar'>;
  assignedBy?: Pick<User, '_id' | 'name'>;
  createdBy: Pick<User, '_id' | 'name'>;
  createdAt: string;
}

export interface Meeting {
  _id: string;
  title: string;
  description: string;
  type: 'call' | 'video' | 'in_person' | 'other';
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  location: string;
  meetingLink: string;
  attendees: Pick<User, '_id' | 'name' | 'email' | 'avatar'>[];
  createdBy: Pick<User, '_id' | 'name'>;
  createdAt: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customer: Pick<Customer, '_id' | 'firstName' | 'lastName' | 'email' | 'company'>;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  notes: string;
  createdBy: Pick<User, '_id' | 'name'>;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Payment {
  _id: string;
  invoice: Pick<Invoice, '_id' | 'invoiceNumber' | 'total'>;
  customer: Pick<Customer, '_id' | 'firstName' | 'lastName' | 'email'>;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  notes: string;
  paymentDate: string;
  createdAt: string;
}

export interface Activity {
  _id: string;
  type: string;
  description: string;
  relatedTo: {
    type: string;
    id: string;
  };
  performedBy: Pick<User, '_id' | 'name' | 'avatar'>;
  createdAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  newCustomersThisMonth: number;
  totalLeads: number;
  activeLeads: number;
  totalInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingTasks: number;
  upcomingMeetings: number;
  conversionRate: number;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}
