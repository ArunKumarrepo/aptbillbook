/**
 * Main Application Component
 * ERP System for Annai Power Tools Rental Shop
 * 
 * Pages:
 * - Admin Dashboard: Overview of operations
 * - Customers: Customer management
 * - Rentals: Equipment rental management
 * - Inventory: Equipment and stock management
 * - Billing: Invoice and payment management
 * - Analytics: Business insights and reporting
 * - Customer Portal: Customer-facing dashboard
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';

// Import pages
import AdminDashboard from './pages/AdminDashboard';
import CustomersPage from './pages/CustomersPage';
import RentalsPage from './pages/RentalsPage';
import BillingAdminPage from './pages/BillingAdminPage';
import InventoryPage from './pages/InventoryPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import CustomerPortal from './pages/CustomerPortal';
import TestDashboard from './pages/TestDashboard';
import BarcodeRentalPage from './pages/BarcodeRentalPage';

// Import components
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Import utilities
import logger from './utils/logger';
import config from './utils/config';

function App() {
  const [currentPage, setCurrentPage] = useState('admin-dashboard');
  const [userRole, setUserRole] = useState('admin'); // 'admin' or 'customer'
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize app
  useEffect(() => {
    logger.info('Application initialized', {
      app: config.app.name,
      version: config.app.version,
      environment: config.app.environment,
    });
    setIsInitialized(true);
  }, []);

  // Navigation handler
  const handleNavigation = (page) => {
    logger.debug('Navigation', { from: currentPage, to: page });
    setCurrentPage(page);
  };

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'admin-dashboard';
      setCurrentPage(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Render current page
  const renderPage = () => {
    try {
      const pages = {
        'admin-dashboard': <AdminDashboard />,
        'customers': <CustomersPage />,
        'rentals': <RentalsPage />,
        'billing': <BillingAdminPage />,
        'inventory': <InventoryPage />,
        'analytics': <AnalyticsDashboard />,
        'customer-portal': <CustomerPortal customerId="1" />,
        'barcode-rental': <BarcodeRentalPage />,
      };

      return pages[currentPage] || <AdminDashboard />;
    } catch (err) {
      console.error('Error rendering page:', err);
      return (
        <div style={{ padding: '20px', color: 'red', background: 'white' }}>
          <h2>Error Loading Page</h2>
          <p>Page: {currentPage}</p>
          <p>{err?.message}</p>
        </div>
      );
    }
  };

  if (!isInitialized) {
    return (
      <ErrorBoundary>
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-gray-900">Initializing...</h1>
            <p className="text-gray-600 mt-2">{config.app.name}</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Layout currentPage={currentPage} onNavigate={handleNavigation} userRole={userRole}>
        <div style={{ minHeight: '100vh', background: 'white' }}>
          {renderPage()}
        </div>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
