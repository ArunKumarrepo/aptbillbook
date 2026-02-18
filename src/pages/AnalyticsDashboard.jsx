/**
 * Analytics Dashboard Page
 * Comprehensive analytics and reporting
 */

import React from 'react';
import { useFetch } from '../hooks/useApi';
import analyticsService from '../services/analyticsService';
import { mockData } from '../utils/mockDataService';
import Alert from '../components/Alert';
import logger from '../utils/logger';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = React.useState('month');

  // Fetch analytics data with demo fallbacks
  const { data: revenueData, loading: revenueLoading } = useFetch(
    () => analyticsService.getRevenueAnalytics({ period: timeRange }),
    mockData.revenueAnalytics
  );

  const { data: rentalData } = useFetch(
    () => analyticsService.getRentalAnalytics({ period: timeRange }),
    { totalRentals: 187, activeRentals: 23, avgDuration: 5.2, trend: 8 }
  );

  const { data: customerData } = useFetch(
    () => analyticsService.getCustomerAnalytics({ period: timeRange }),
    { totalCustomers: 42, newCustomers: 5, avgLTV: 8500, retentionRate: 92 }
  );

  const { data: equipmentData } = useFetch(
    () => analyticsService.getEquipmentUtilization({ period: timeRange }),
    { totalEquipment: 4, avgUtilization: 78, revenuePerEquipment: 36250, maintenanceCost: 5000 }
  );

  const { data: financialData } = useFetch(
    () => analyticsService.getFinancialSummary({ period: timeRange }),
    { totalRevenue: 145000, totalExpenses: 25000, netProfit: 120000, profitMargin: 82.75 }
  );

  const { data: trendsData } = useFetch(
    () => analyticsService.getTrends({ period: timeRange }),
    [{ icon: '📈', title: 'Revenue Up', description: '+12.5% compared to last month' }]
  );

  const ChartPlaceholder = ({ title, height = 64 }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className={`h-${height} bg-gray-50 rounded flex items-center justify-center text-gray-500`}>
        Chart visualization will appear here
      </div>
    </div>
  );

  const StatBox = ({ label, value, change, color = 'blue' }) => (
    <div className={`bg-white p-4 rounded-lg shadow border-l-4 border-${color}-500`}>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {change && (
        <p className={`text-xs mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}% vs last period
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatBox
            label="Total Revenue"
            value={`₹${(financialData?.totalRevenue || 0).toLocaleString()}`}
            change={financialData?.revenueTrend}
            color="green"
          />
          <StatBox
            label="Total Expenses"
            value={`₹${(financialData?.totalExpenses || 0).toLocaleString()}`}
            change={financialData?.expenseTrend}
            color="red"
          />
          <StatBox
            label="Net Profit"
            value={`₹${(financialData?.netProfit || 0).toLocaleString()}`}
            change={financialData?.profitTrend}
            color="blue"
          />
          <StatBox
            label="Profit Margin"
            value={`${financialData?.profitMargin || 0}%`}
            color="purple"
          />
        </div>

        {/* Rental Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox
            label="Total Rentals"
            value={rentalData?.totalRentals || 0}
            change={rentalData?.trend}
            color="yellow"
          />
          <StatBox
            label="Active Rentals"
            value={rentalData?.activeRentals || 0}
            color="blue"
          />
          <StatBox
            label="Avg. Rental Duration"
            value={`${rentalData?.avgDuration || 0} days`}
            color="indigo"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder title="Revenue Trend" height={64} />
          <ChartPlaceholder title="Rental Volume" height={64} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder title="Equipment Utilization" height={64} />
          <ChartPlaceholder title="Customer Growth" height={64} />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Metrics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Customers</span>
                <span className="font-semibold">{customerData?.totalCustomers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Customers</span>
                <span className="font-semibold">{customerData?.newCustomers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Customer Lifetime Value</span>
                <span className="font-semibold">₹{(customerData?.avgLTV || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Retention Rate</span>
                <span className="font-semibold">{customerData?.retentionRate || 0}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Equipment Performance</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Equipment</span>
                <span className="font-semibold">{equipmentData?.totalEquipment || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Utilization</span>
                <span className="font-semibold">{equipmentData?.avgUtilization || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue per Equipment</span>
                <span className="font-semibold">₹{(equipmentData?.revenuePerEquipment || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Maintenance Cost</span>
                <span className="font-semibold">₹{(equipmentData?.maintenanceCost || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trends Section */}
        {trendsData && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Trends</h2>
            <div className="space-y-2">
              {trendsData.length === 0 ? (
                <p className="text-gray-600">No trend data available</p>
              ) : (
                trendsData.map((trend, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 border-b">
                    <span className="text-2xl">{trend.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{trend.title}</p>
                      <p className="text-sm text-gray-600">{trend.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  export default AnalyticsDashboard;
