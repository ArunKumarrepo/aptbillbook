/**
 * Inventory Service
 * API calls for equipment and inventory management
 */

import apiService from './apiService';

const ENDPOINT = '/inventory';

const inventoryService = {
  // Get all equipment
  getEquipment: async (params = {}) => {
    return apiService.get(ENDPOINT, { params });
  },

  // Get single equipment
  getEquipmentById: async (id) => {
    return apiService.get(`${ENDPOINT}/${id}`);
  },

  // Add new equipment
  addEquipment: async (data) => {
    return apiService.post(ENDPOINT, data);
  },

  // Update equipment
  updateEquipment: async (id, data) => {
    return apiService.put(`${ENDPOINT}/${id}`, data);
  },

  // Update equipment status
  updateEquipmentStatus: async (id, status) => {
    return apiService.patch(`${ENDPOINT}/${id}/status`, { status });
  },

  // Get equipment by barcode
  getEquipmentByBarcode: async (barcode) => {
    return apiService.get(ENDPOINT, { params: { barcode } });
  },

  // Get inventory report
  getInventoryReport: async (params = {}) => {
    return apiService.get(`${ENDPOINT}/report`, { params });
  },

  // Get low stock items
  getLowStockItems: async () => {
    return apiService.get(`${ENDPOINT}/low-stock`);
  },

  // Update stock quantity
  updateStockQuantity: async (id, quantity) => {
    return apiService.patch(`${ENDPOINT}/${id}/quantity`, { quantity });
  },

  // Get equipment categories
  getCategories: async () => {
    return apiService.get(`${ENDPOINT}/categories`);
  },

  // Delete equipment (soft delete)
  deleteEquipment: async (id) => {
    return apiService.delete(`${ENDPOINT}/${id}`);
  },
};

export default inventoryService;
