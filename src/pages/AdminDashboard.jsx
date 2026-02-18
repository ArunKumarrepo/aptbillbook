/**
 * Admin Dashboard Page
 * Overview of shop operations and key metrics
 */

import React, { useState } from 'react';
import { useFetch } from '../hooks/useApi';
import analyticsService from '../services/analyticsService';
import rentalService from '../services/rentalService';
import billingService from '../services/billingService';
import { mockData } from '../utils/mockDataService';
import Alert from '../components/Alert';
import logger from '../utils/logger';

const AdminDashboard = () => {
  const [alerts, setAlerts] = useState([]);

  // Fetch dashboard data with demo data fallback
  const { data: dashboardData, loading: dashLoading, error: dashError } = useFetch(
    () => analyticsService.getDashboardOverview({ period: 'month' }),
    mockData.dashboardOverview
  );

  const { data: revenueData, loading: revenueLoading } = useFetch(
    () => analyticsService.getRevenueAnalytics({ period: 'month' }),
    mockData.revenueAnalytics
  );

  const { data: rentalStats, loading: statsLoading } = useFetch(
    () => rentalService.getRentalStats({}),
    mockData.rentalStats
  );

  const { data: overdueData } = useFetch(
    () => billingService.getOverdueInvoices({ limit: 5 }),
    mockData.overdue
  );

  // Handle errors
  React.useEffect(() => {
    if (dashError) {
      addAlert('error', 'Error loading dashboard', dashError.message);
    }
  }, [dashError]);

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const StatCard = ({ title, value, trend, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  if (dashLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-96" style={{ background: '#f5f5f5' }}>
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Alerts */}
        <div className="space-y-3">
          {alerts.map(alert => (
            <Alert
              key={alert.id}
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onClose={() => removeAlert(alert.id)}
            />
          ))}
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`₹${(dashboardData?.totalRevenue || 0).toLocaleString()}`}
            trend={dashboardData?.revenueTrend}
            icon="💰"
          />
          <StatCard
            title="Active Rentals"
            value={rentalStats?.active || 0}
            trend={rentalStats?.trend}
            icon="📦"
          />
          <StatCard
            title="Pending Payments"
            value={`₹${(dashboardData?.pendingPayments || 0).toLocaleString()}`}
            icon="⏳"
          />
          <StatCard
            title="Total Customers"
            value={dashboardData?.totalCustomers || 0}
            icon="👥"
          />
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Trend</h2>
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-500">
              {revenueLoading ? 'Loading chart...' : 'Chart will display here'}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Daily Revenue</span>
                <span className="font-semibold">₹{(dashboardData?.avgDailyRevenue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Equipment Utilization</span>
                <span className="font-semibold">{dashboardData?.equipmentUtilization || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Satisfaction</span>
                <span className="font-semibold">{dashboardData?.satisfaction || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Invoices */}
        {overdueData && overdueData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">⚠️ Overdue Invoices</h2>
            <div className="space-y-2">
              {overdueData.slice(0, 5).map(invoice => (
                <div key={invoice.id} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p className="font-medium">{invoice.customerName}</p>
                    <p className="text-sm text-gray-600">Invoice: {invoice.invoiceNumber}</p>
                  </div>
                  <span className="font-semibold text-red-600">₹{invoice.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminDashboard;
