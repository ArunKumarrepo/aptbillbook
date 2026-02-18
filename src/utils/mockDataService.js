/**
 * Mock Data Service
 * Provides demo data when API is not available
 * Useful for development and testing without actual backend
 */

import logger from '../utils/logger';
import config from '../utils/config';

const mockDelay = (ms = config.demo.mockDelay) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const mockData = {
  // Dashboard data
  dashboardOverview: {
    totalRevenue: 145000,
    revenueTrend: 12.5,
    pendingPayments: 28500,
    totalCustomers: 42,
    avgDailyRevenue: 4500,
    equipmentUtilization: 78,
    satisfaction: 92,
  },

  revenueAnalytics: {
    totalRevenue: 145000,
    revenueTrend: 12.5,
    monthlyRevenue: [45000, 48000, 52000],
    topProducts: ['Power Drill', 'Concrete Mixer', 'Impact Driver'],
  },

  rentalStats: {
    active: 23,
    completed: 156,
    pending: 8,
    trend: 8.3,
  },

  customers: [
    { id: 1, name: 'Ramesh Kumar', email: 'ramesh@example.com', phone: '9876543210', city: 'Chennai', address: '123 Main St' },
    { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '9876543211', city: 'Bangalore', address: '456 Oak Ave' },
    { id: 3, name: 'Amit Patel', email: 'amit@example.com', phone: '9876543212', city: 'Mumbai', address: '789 Pine Rd' },
    { id: 4, name: 'Neha Sharma', email: 'neha@example.com', phone: '9876543213', city: 'Hyderabad', address: '321 Elm St' },
    { id: 5, name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543214', city: 'Pune', address: '654 Maple Dr' },
  ],

  rentals: [
    { id: 1, rentalNumber: 'RNT001', customerName: 'Ramesh Kumar', equipmentName: 'Power Drill', startDate: '2026-02-10', endDate: '2026-02-15', status: 'active', amount: 2500 },
    { id: 2, rentalNumber: 'RNT002', customerName: 'Priya Singh', equipmentName: 'Concrete Mixer', startDate: '2026-02-12', endDate: '2026-02-18', status: 'active', amount: 5000 },
    { id: 3, rentalNumber: 'RNT003', customerName: 'Amit Patel', equipmentName: 'Impact Driver', startDate: '2026-02-01', endDate: '2026-02-08', status: 'returned', amount: 1800 },
  ],

  invoices: [
    { id: 1, invoiceNumber: 'INV001', customerName: 'Ramesh Kumar', amount: 2500, paidAmount: 2500, status: 'paid', invoiceDate: '2026-02-08', dueDate: '2026-02-20' },
    { id: 2, invoiceNumber: 'INV002', customerName: 'Priya Singh', amount: 5000, paidAmount: 2500, status: 'pending', invoiceDate: '2026-02-15', dueDate: '2026-03-01' },
    { id: 3, invoiceNumber: 'INV003', customerName: 'Amit Patel', amount: 1800, paidAmount: 0, status: 'overdue', invoiceDate: '2026-01-25', dueDate: '2026-02-14' },
  ],

  equipment: [
    { id: 1, name: 'Power Drill', category: 'Drills', quantity: 5, minStock: 2, rentalRate: 500, purchasePrice: 8000, status: 'available', description: 'High-power electric drill' },
    { id: 2, name: 'Concrete Mixer', category: 'Mixers', quantity: 2, minStock: 1, rentalRate: 1200, purchasePrice: 35000, status: 'available', description: 'Heavy-duty concrete mixer' },
    { id: 3, name: 'Impact Driver', category: 'Drivers', quantity: 8, minStock: 2, rentalRate: 400, purchasePrice: 6500, status: 'available', description: 'Compact impact driver' },
    { id: 4, name: 'Angle Grinder', category: 'Grinders', quantity: 3, minStock: 2, rentalRate: 350, purchasePrice: 3500, status: 'maintenance', description: 'Powerful angle grinder' },
  ],

  revenueAnalytics: {
    totalRevenue: 145000,
    data: [
      { month: 'Jan', revenue: 42000 },
      { month: 'Feb', revenue: 48000 },
      { month: 'Mar', revenue: 55000 },
    ],
  },

  analyticsData: {
    revenue: { total: 145000, trend: 12.5 },
    rentals: { total: 187, avgDuration: 5.2 },
    customers: { total: 42, new: 8, retention: 85 },
    equipment: { utilization: 78, maintenance: 2 },
  },

  overdue: [
    { id: 3, invoiceNumber: 'INV003', customerName: 'Amit Patel', amount: 1800, daysOverdue: 5 },
  ],

  categories: [
    { id: 1, name: 'Drills' },
    { id: 2, name: 'Mixers' },
    { id: 3, name: 'Drivers' },
    { id: 4, name: 'Grinders' },
    { id: 5, name: 'Saws' },
  ],
};

const mockDataService = {
  // Analytics
  getDashboardOverview: async () => {
    await mockDelay();
    logger.debug('Mock: getDashboardOverview');
    return mockData.dashboardOverview;
  },

  getRevenueAnalytics: async () => {
    await mockDelay();
    return mockData.revenueAnalytics;
  },

  getRentalAnalytics: async () => {
    await mockDelay();
    return mockData.rentalStats;
  },

  getCustomerAnalytics: async () => {
    await mockDelay();
    return { totalCustomers: 42, newCustomers: 5, avgLTV: 8500, retentionRate: 92 };
  },

  getEquipmentUtilization: async () => {
    await mockDelay();
    return { totalEquipment: 4, avgUtilization: 78, revenuePerEquipment: 36250, maintenanceCost: 5000 };
  },

  getFinancialSummary: async () => {
    await mockDelay();
    return { totalRevenue: 145000, totalExpenses: 25000, netProfit: 120000, profitMargin: 82.75 };
  },

  getTrends: async () => {
    await mockDelay();
    return [
      { icon: '📈', title: 'Revenue Up', description: '+12.5% compared to last month' },
      { icon: '👥', title: 'New Customers', description: '8 new customers this month' },
    ];
  },

  // Customers
  getCustomers: async () => {
    await mockDelay();
    return mockData.customers;
  },

  getCustomer: async (id) => {
    await mockDelay();
    return mockData.customers.find(c => c.id === parseInt(id)) || mockData.customers[0];
  },

  // Rentals
  getRentals: async () => {
    await mockDelay();
    return mockData.rentals;
  },

  getRentalStats: async () => {
    await mockDelay();
    return mockData.rentalStats;
  },

  // Billing
  getInvoices: async () => {
    await mockDelay();
    return mockData.invoices;
  },

  getOverdueInvoices: async () => {
    await mockDelay();
    return mockData.overdue;
  },

  getBillingSummary: async () => {
    await mockDelay();
    return {
      totalOutstanding: 6800,
      totalPaid: 138200,
      overdueAmount: 1800,
    };
  },

  // Inventory
  getEquipment: async () => {
    await mockDelay();
    return mockData.equipment;
  },

  getCategories: async () => {
    await mockDelay();
    return mockData.categories;
  },

  getLowStockItems: async () => {
    await mockDelay();
    return mockData.equipment.filter(e => e.quantity <= e.minStock);
  },

  // Customer Portal
  getCustomerRentals: async (customerId) => {
    await mockDelay();
    return mockData.rentals.slice(0, 2);
  },

  getCustomerBilling: async (customerId) => {
    await mockDelay();
    return mockData.invoices.slice(0, 2);
  },
};

export default mockDataService;
