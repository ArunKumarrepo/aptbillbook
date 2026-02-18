/**
 * Customer Portal Dashboard
 * Customer-facing portal to view rentals, invoices, and profile
 */

import React, { useState } from 'react';
import { useFetch } from '../hooks/useApi';
import customerService from '../services/customerService';
import billingService from '../services/billingService';
import { mockData } from '../utils/mockDataService';
import Table from '../components/Table';
import Alert from '../components/Alert';
import logger from '../utils/logger';

const CustomerPortal = ({ customerId = '1' }) => {
  const [alerts, setAlerts] = useState([]);

  // Fetch customer data with demo fallbacks
  const { data: customer, loading: customerLoading } = useFetch(
    () => customerService.getCustomer(customerId),
    mockData.customers[0]
  );

  const { data: rentals, loading: rentalsLoading } = useFetch(
    () => customerService.getCustomerRentals(customerId, { limit: 50 }),
    mockData.rentals.slice(0, 2)
  );

  const { data: invoices, loading: invoicesLoading } = useFetch(
    () => customerService.getCustomerBilling(customerId, { limit: 50 }),
    mockData.invoices.slice(0, 2)
  );

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const rentalColumns = [
    { key: 'rentalNumber', label: 'Rental #' },
    { 
      key: 'equipmentName', 
      label: 'Equipment',
      render: (_, row) => row.equipment?.name || 'N/A'
    },
    { key: 'startDate', label: 'From' },
    { key: 'endDate', label: 'To' },
    { key: 'status', label: 'Status' },
    { 
      key: 'amount',
      label: 'Amount',
      render: (val) => `₹${val?.toLocaleString()}`
    },
  ];

  const invoiceColumns = [
    { key: 'invoiceNumber', label: 'Invoice #' },
    { key: 'invoiceDate', label: 'Date' },
    { 
      key: 'amount',
      label: 'Amount',
      render: (val) => `₹${val?.toLocaleString()}`
    },
    { 
      key: 'paidAmount',
      label: 'Paid',
      render: (val) => `₹${val?.toLocaleString()}`
    },
    { key: 'dueDate', label: 'Due Date' },
    { 
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          val === 'paid' ? 'bg-green-100 text-green-800' :
          val === 'overdue' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {val}
        </span>
      )
    },
  ];

  const totalOutstanding = invoices?.reduce((sum, inv) => 
    sum + (inv.amount - inv.paidAmount), 0
  ) || 0;

  const overallStats = [
    {
      title: 'Active Rentals',
      value: rentals?.filter(r => r.status === 'active').length || 0,
      icon: '📦'
    },
    {
      title: 'Total Spent',
      value: `₹${invoices?.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString() || 0}`,
      icon: '💰'
    },
    {
      title: 'Outstanding',
      value: `₹${totalOutstanding.toLocaleString()}`,
      icon: '⏳'
    },
  ];

  if (customerLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading your portal...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {customer?.name}!
          </h1>
          <p className="text-gray-600 mt-1">Manage your rentals and invoices</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {overallStats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Outstanding Invoices Alert */}
        {totalOutstanding > 0 && (
          <Alert
            type="warning"
            title="Outstanding Amount"
            message={`You have ₹${totalOutstanding.toLocaleString()} outstanding. Please pay at your earliest convenience.`}
          />
        )}

        {/* My Rentals */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Rentals</h2>
          {rentalsLoading ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p>Loading rentals...</p>
            </div>
          ) : (
            <Table
              columns={rentalColumns}
              data={rentals || []}
              searchable={true}
              sortable={true}
              pageSize={10}
            />
          )}
        </div>

        {/* My Invoices */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Invoices</h2>
          {invoicesLoading ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p>Loading invoices...</p>
            </div>
          ) : (
            <Table
              columns={invoiceColumns}
              data={invoices || []}
              searchable={true}
              sortable={true}
              pageSize={10}
            />
          )}
        </div>

        {/* Customer Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Name</p>
              <p className="text-lg font-semibold text-gray-900">{customer?.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-lg font-semibold text-gray-900">{customer?.email || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="text-lg font-semibold text-gray-900">{customer?.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">City</p>
              <p className="text-lg font-semibold text-gray-900">{customer?.city || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600 text-sm">Address</p>
              <p className="text-lg font-semibold text-gray-900">{customer?.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default CustomerPortal;
