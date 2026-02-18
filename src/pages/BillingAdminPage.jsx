/**
 * Billing Admin Page
 * Invoice management, payment tracking, and accounting
 */

import React, { useState } from 'react';
import { useFetch } from '../hooks/useApi';
import billingService from '../services/billingService';
import rentalService from '../services/rentalService';
import barcodeService from '../services/barcodeService';
import { mockData } from '../utils/mockDataService';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Form, Input, Select, Button } from '../components/Form';
import Alert from '../components/Alert';
import logger from '../utils/logger';

const BillingAdminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    notes: '',
  });

  // Fetch data with demo fallbacks
  const { data: invoices, loading, refetch } = useFetch(
    () => billingService.getInvoices({ limit: 50, offset: 0 }),
    mockData.invoices
  );

  const { data: overdueData } = useFetch(
    () => billingService.getOverdueInvoices({ limit: 10 }),
    mockData.overdue
  );

  const { data: summaryData } = useFetch(
    () => billingService.getBillingSummary({}),
    { totalOutstanding: 6800, totalPaid: 138200, overdueAmount: 1800 }
  );

  const { data: rentals } = useFetch(
    () => rentalService.getRentals({ limit: 100, status: 'completed' }),
    mockData.rentals
  );

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      await billingService.createInvoice(data);
      addAlert('success', 'Success', 'Invoice created successfully');
      logger.info('Invoice created');
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      addAlert('error', 'Error', error.message || 'Failed to create invoice');
      logger.error('Invoice creation error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await billingService.recordPayment({
        invoiceId: selectedInvoice.id,
        ...paymentData,
        paymentDate: new Date(),
      });
      addAlert('success', 'Success', 'Payment recorded successfully');
      logger.info('Payment recorded', { invoiceId: selectedInvoice.id });
      setIsPaymentModalOpen(false);
      setPaymentData({ amount: '', paymentMethod: 'cash', notes: '' });
      refetch();
    } catch (error) {
      addAlert('error', 'Error', error.message || 'Failed to record payment');
      logger.error('Payment recording error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintInvoice = async (invoiceId) => {
    try {
      const invoice = invoices.find(i => i.id === invoiceId);
      const barcode = barcodeService.generateBarcode(invoice.invoiceNumber);
      logger.info('Invoice barcode generated', { invoiceId });
      window.print(); // Trigger browser print
      addAlert('success', 'Ready to Print', 'Invoice is ready to print');
    } catch (error) {
      addAlert('error', 'Error', 'Failed to print invoice');
      logger.error('Print error', error);
    }
  };

  const handleSendReminder = async (invoiceId) => {
    try {
      await billingService.sendInvoiceReminder(invoiceId);
      addAlert('success', 'Success', 'Payment reminder sent');
      logger.info('Reminder sent', { invoiceId });
    } catch (error) {
      addAlert('error', 'Error', 'Failed to send reminder');
      logger.error('Reminder error', error);
    }
  };

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice #' },
    { 
      key: 'customerName', 
      label: 'Customer',
      render: (_, row) => row.customer?.name || 'N/A'
    },
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
    { key: 'status', label: 'Status' },
    { key: 'invoiceDate', label: 'Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handlePrintInvoice(row.id)}
            className="text-green-600 hover:text-green-800 underline text-sm"
          >
            Print
          </button>
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => {
                  setSelectedInvoice(row);
                  setIsPaymentModalOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Pay
              </button>
              <button
                onClick={() => handleSendReminder(row.id)}
                className="text-orange-600 hover:text-orange-800 underline text-sm"
              >
                Remind
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Accounting</h1>
            <p className="text-gray-600 mt-1">Manage invoices and payments</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="primary">
            ➕ New Invoice
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Outstanding"
            value={`₹${(summaryData?.totalOutstanding || 0).toLocaleString()}`}
            icon="⏳"
          />
          <StatCard
            title="Total Paid"
            value={`₹${(summaryData?.totalPaid || 0).toLocaleString()}`}
            icon="✓"
          />
          <StatCard
            title="Overdue Amount"
            value={`₹${(summaryData?.overdueAmount || 0).toLocaleString()}`}
            icon="⚠️"
          />
        </div>

        {/* Overdue Invoices Alert */}
        {overdueData && overdueData.length > 0 && (
          <Alert
            type="warning"
            title="Overdue Invoices"
            message={`You have ${overdueData.length} overdue invoice(s) totaling ₹${overdueData.reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0).toLocaleString()}`}
          />
        )}

        {/* Table */}
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p>Loading invoices...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={invoices || []}
            searchable={true}
            sortable={true}
            pageSize={10}
          />
        )}

        {/* Create Invoice Modal */}
        <Modal
          isOpen={isModalOpen}
          title="Create Invoice"
          onClose={() => setIsModalOpen(false)}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                form="createInvoiceForm"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Create Invoice
              </Button>
            </>
          }
        >
          <form id="createInvoiceForm" onSubmit={handleCreateInvoice}>
            <Select
              label="Select Rental"
              name="rentalId"
              options={(rentals || []).map(r => ({
                value: r.id,
                label: `${r.customer?.name} - ${r.equipment?.name}`,
              }))}
              placeholder="Choose a rental to invoice"
              required
            />
            <Input
              label="Invoice Date"
              name="invoiceDate"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              required
            />
            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              required
            />
          </form>
        </Modal>

        {/* Payment Modal */}
        <Modal
          isOpen={isPaymentModalOpen}
          title="Record Payment"
          onClose={() => setIsPaymentModalOpen(false)}
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsPaymentModalOpen(false)}>
                Cancel
              </Button>
              <Button
                form="paymentForm"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Record Payment
              </Button>
            </>
          }
        >
          <form id="paymentForm" onSubmit={handleRecordPayment}>
            {selectedInvoice && (
              <div className="mb-4 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Invoice: {selectedInvoice.invoiceNumber}</p>
                <p className="text-lg font-semibold">₹{(selectedInvoice.amount - selectedInvoice.paidAmount).toLocaleString()}</p>
              </div>
            )}
            <Input
              label="Payment Amount (₹)"
              name="amount"
              type="number"
              value={paymentData.amount}
              onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              required
            />
            <Select
              label="Payment Method"
              name="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'check', label: 'Check' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'upi', label: 'UPI' },
              ]}
              required
            />
            <Input
              label="Notes"
              name="notes"
              value={paymentData.notes}
              onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Reference number, cheque number, etc."
            />
          </form>
        </Modal>
      </div>
    );
  };

export default BillingAdminPage;
