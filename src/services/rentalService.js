/**
 * Rental Service
 * API calls for equipment rental management
 */

import apiService from './apiService';

const ENDPOINT = '/rentals';

const rentalService = {
  // Get all rentals with filters
  getRentals: async (params = {}) => {
    return apiService.get(ENDPOINT, { params });
  },

  // Get single rental by ID
  getRental: async (id) => {
    return apiService.get(`${ENDPOINT}/${id}`);
  },

  // Create new rental
  createRental: async (data) => {
    return apiService.post(ENDPOINT, data);
  },

  // Update rental
  updateRental: async (id, data) => {
    return apiService.put(`${ENDPOINT}/${id}`, data);
  },

  // Return rental equipment
  returnRental: async (id, data) => {
    return apiService.patch(`${ENDPOINT}/${id}/return`, data);
  },

  // Get available equipment
  getAvailableEquipment: async (params = {}) => {
    return apiService.get('/equipment/available', { params });
  },

  // Get rental by barcode
  getRentalByBarcode: async (barcode) => {
    return apiService.get(ENDPOINT, { params: { barcode } });
  },

  // Cancel rental
  cancelRental: async (id, reason) => {
    return apiService.patch(`${ENDPOINT}/${id}/cancel`, { reason });
  },

  // Extend rental
  extendRental: async (id, data) => {
    return apiService.patch(`${ENDPOINT}/${id}/extend`, data);
  },

  // Get rental statistics
  getRentalStats: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/stats`, { params });
  },
};

export default rentalService;
