/**
 * Customer Service
 * API calls for customer management
 */

import apiService from './apiService';

const ENDPOINT = '/customers';

const customerService = {
  // Get all customers with pagination and filters
  getCustomers: async (params = {}) => {
    return apiService.get(ENDPOINT, { params });
  },

  // Get single customer by ID
  getCustomer: async (id) => {
    return apiService.get(`${ENDPOINT}/${id}`);
  },

  // Create new customer
  createCustomer: async (data) => {
    return apiService.post(ENDPOINT, data);
  },

  // Update customer information
  updateCustomer: async (id, data) => {
    return apiService.put(`${ENDPOINT}/${id}`, data);
  },

  // Get customer rental history
  getCustomerRentals: async (customerId, params = {}) => {
    return apiService.get(`${ENDPOINT}/${customerId}/rentals`, { params });
  },

  // Get customer billing history
  getCustomerBilling: async (customerId, params = {}) => {
    return apiService.get(`${ENDPOINT}/${customerId}/billing`, { params });
  },

  // Search customers
  searchCustomers: async (query) => {
    return apiService.get(ENDPOINT, { params: { search: query } });
  },

  // Delete customer (soft delete)
  deleteCustomer: async (id) => {
    return apiService.delete(`${ENDPOINT}/${id}`);
  },
};

export default customerService;
