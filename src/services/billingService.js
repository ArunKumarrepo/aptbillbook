/**
 * Billing Service
 * API calls for billing and invoicing
 */

import apiService from './apiService';

const ENDPOINT = '/billing';

const billingService = {
  // Get all invoices
  getInvoices: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/invoices`, { params });
  },

  // Get single invoice
  getInvoice: async (id) => {
    return apiService.get(`${ENDPOINT}/invoices/${id}`);
  },

  // Create invoice from rental
  createInvoice: async (data) => {
    return apiService.post(`${ENDPOINT}/invoices`, data);
  },

  // Update invoice
  updateInvoice: async (id, data) => {
    return apiService.put(`${ENDPOINT}/invoices/${id}`, data);
  },

  // Mark invoice as paid
  markInvoiceAsPaid: async (id, data) => {
    return apiService.patch(`${ENDPOINT}/invoices/${id}/mark-paid`, data);
  },

  // Generate invoice PDF
  generateInvoicePDF: async (invoiceId) => {
    return apiService.get(`${ENDPOINT}/invoices/${invoiceId}/pdf`);
  },

  // Get pending payments
  getPendingPayments: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/pending-payments`, { params });
  },

  // Record payment
  recordPayment: async (data) => {
    return apiService.post(`${ENDPOINT}/payments`, data);
  },

  // Get payment history
  getPaymentHistory: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/payments`, { params });
  },

  // Get billing summary
  getBillingSummary: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/summary`, { params });
  },

  // Get overdue invoices
  getOverdueInvoices: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/overdue`, { params });
  },

  // Send invoice reminder
  sendInvoiceReminder: async (invoiceId) => {
    return apiService.post(`${ENDPOINT}/invoices/${invoiceId}/send-reminder`, {});
  },
};

export default billingService;
