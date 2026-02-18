/**
 * Customers Management Page
 * CRUD operations for customer management
 */

import React, { useState } from 'react';
import { useFetch } from '../hooks/useApi';
import customerService from '../services/customerService';
import { mockData } from '../utils/mockDataService';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Form, Input, Button, Textarea } from '../components/Form';
import Alert from '../components/Alert';
import logger from '../utils/logger';

const CustomersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });
  const [alerts, setAlerts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch customers with demo data fallback
  const { data: customers, loading, error, refetch } = useFetch(
    () => customerService.getCustomers({ limit: 50, offset: 0 }),
    mockData.customers
  );

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, formData);
        addAlert('success', 'Success', 'Customer updated successfully');
        logger.info('Customer updated', { customerId: editingCustomer.id });
      } else {
        await customerService.createCustomer(formData);
        addAlert('success', 'Success', 'Customer created successfully');
        logger.info('Customer created', { name: formData.name });
      }
      handleCloseModal();
      refetch();
    } catch (error) {
      addAlert('error', 'Error', error.message || 'Failed to save customer');
      logger.error('Customer save error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerService.deleteCustomer(id);
      addAlert('success', 'Success', 'Customer deleted successfully');
      logger.info('Customer deleted', { customerId: id });
      refetch();
    } catch (error) {
      addAlert('error', 'Error', error.message || 'Failed to delete customer');
      logger.error('Customer delete error', error);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteCustomer(row.id)}
            className="text-red-600 hover:text-red-800 underline text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Manage all customer information</p>
          </div>
          <Button onClick={() => handleOpenModal()} variant="primary">
            ➕ New Customer
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p>Loading customers...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={customers || []}
            searchable={true}
            sortable={true}
            pageSize={10}
          />
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          title={editingCustomer ? 'Edit Customer' : 'New Customer'}
          onClose={handleCloseModal}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {editingCustomer ? 'Update' : 'Create'}
              </Button>
            </>
          }
        >
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="john@example.com"
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="+91 98765 43210"
                required
              />
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                placeholder="Chennai"
              />
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="123 Main St"
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleFormChange}
                placeholder="Tamil Nadu"
              />
              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleFormChange}
                placeholder="600001"
              />
            </div>
            <Textarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              placeholder="Additional customer notes..."
              rows={3}
            />
          </Form>
        </Modal>
      </div>
    );
  };

export default CustomersPage;
