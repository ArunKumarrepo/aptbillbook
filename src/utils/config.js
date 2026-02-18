/**
 * Application Configuration
 * Centralized configuration for API endpoints, logging levels, and app settings
 */

const ENV = process.env.NODE_ENV || 'development';

const config = {
  app: {
    name: 'Annai Power Tools ERP',
    version: '1.0.0',
    environment: ENV,
  },
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 30000,
  },
  logging: {
    enabled: true,
    level: import.meta.env.VITE_LOG_LEVEL || 'info', // 'debug', 'info', 'warn', 'error'
    logToConsole: ENV !== 'production',
    logToFile: ENV === 'production',
  },
  features: {
    barcodePrinting: true,
    analytics: true,
    accounting: true,
    customerManagement: true,
    inventoryManagement: true,
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },
  demo: {
    enabled: import.meta.env.VITE_DEMO_MODE !== 'false', // Enable demo mode by default
    mockDelay: 300, // Simulate network delay in ms
  },
};

export default config;
