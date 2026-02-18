/**
 * Analytics Service
 * API calls for analytics and reporting
 */

import apiService from './apiService';

const ENDPOINT = '/analytics';

const analyticsService = {
  // Get dashboard overview
  getDashboardOverview: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/dashboard`, { params });
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/revenue`, { params });
  },

  // Get rental analytics
  getRentalAnalytics: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/rentals`, { params });
  },

  // Get customer analytics
  getCustomerAnalytics: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/customers`, { params });
  },

  // Get equipment utilization
  getEquipmentUtilization: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/equipment-utilization`, { params });
  },

  // Get financial summary
  getFinancialSummary: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/financial-summary`, { params });
  },

  // Get sales report
  getSalesReport: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/sales`, { params });
  },

  // Get customer lifetime value
  getCustomerLTV: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/customer-ltv`, { params });
  },

  // Export report
  exportReport: async (reportType, params = {}) => {
    return apiService.post(`${ENDPOINT}/export`, { reportType, ...params });
  },

  // Get trends
  getTrends: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/trends`, { params });
  },
};

export default analyticsService;
