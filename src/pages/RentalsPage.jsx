/**
 * Rentals Management Page
 * View, create, and manage equipment rentals
 */

import React, { useState } from 'react';
import { useFetch, useApi } from '../hooks/useApi';
import rentalService from '../services/rentalService';
import customerService from '../services/customerService';
import inventoryService from '../services/inventoryService';
import { mockData } from '../utils/mockDataService';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Form, Input, Select, Button, Textarea } from '../components/Form';
import Alert from '../components/Alert';
import logger from '../utils/logger';

const RentalsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    customerId: '',
    equipmentId: '',
    rentalStartDate: '',
    rentalEndDate: '',
    rentalRate: '',
    notes: '',
  });

  // Fetch data with demo fallbacks
  const { data: rentals, loading, refetch } = useFetch(
    () => rentalService.getRentals({ limit: 50, offset: 0 }),
    mockData.rentals
  );

  const { data: customers } = useFetch(
    () => customerService.getCustomers({ limit: 100 }),
    mockData.customers
  );

  const { data: equipment } = useFetch(
    () => inventoryService.getEquipment({ limit: 100 }),
    mockData.equipment
  );

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleOpenModal = (rental = null) => {
    if (rental) {
      setEditingRental(rental);
      setFormData(rental);
    } else {
      setEditingRental(null);
      setFormData({
        customerId: '',
        equipmentId: '',
        rentalStartDate: '',
        rentalEndDate: '',
        rentalRate: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRental(null);
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
      if (editingRental) {
        await rentalService.updateRental(editingRental.id, formData);
        addAlert('success', 'Success', 'Rental updated successfully');
        logger.info('Rental updated', { rentalId: editingRental.id });
      } else {
        await rentalService.createRental(formData);
        addAlert('success', 'Success', 'Rental created successfully');
        logger.info('Rental created', { customerId: formData.customerId });
      }
      handleCloseModal();
      refetch();
    } catch (error) {
      addAlert('error', 'Error', error.message || 'Failed to save rental');
      logger.error('Rental save error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnRental = async (id) => {
    try {
      await rentalService.returnRental(id, { returnDate: new Date() });
      addAlert('success', 'Success', 'Equipment returned successfully');
      logger.info('Equipment returned', { rentalId: id });
      refetch();
    } catch (error) {
      addAlert('error', 'Error', error.message || 'Failed to return equipment');
      logger.error('Return error', error);
    }
  };

  const columns = [
    { key: 'rentalNumber', label: 'Rental #' },
    { 
      key: 'customerName', 
      label: 'Customer',
      render: (_, row) => row.customer?.name || 'N/A'
    },
    { 
      key: 'equipmentName', 
      label: 'Equipment',
      render: (_, row) => row.equipment?.name || 'N/A'
    },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'status', label: 'Status' },
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
          {row.status !== 'returned' && (
            <button
              onClick={() => handleReturnRental(row.id)}
              className="text-green-600 hover:text-green-800 underline text-sm"
            >
              Return
            </button>
          )}
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
            <h1 className="text-3xl font-bold text-gray-900">Rentals</h1>
            <p className="text-gray-600 mt-1">Manage equipment rentals</p>
          </div>
          <Button onClick={() => handleOpenModal()} variant="primary">
            ➕ New Rental
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p>Loading rentals...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={rentals || []}
            searchable={true}
            sortable={true}
            pageSize={10}
          />
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          title={editingRental ? 'Edit Rental' : 'New Rental'}
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
                {editingRental ? 'Update' : 'Create'}
              </Button>
            </>
          }
        >
          <Form onSubmit={handleSubmit}>
            <Select
              label="Customer"
              name="customerId"
              value={formData.customerId}
              onChange={handleFormChange}
              options={(customers || []).map(c => ({
                value: c.id,
                label: c.name,
              }))}
              placeholder="Select customer"
              required
            />
            <Select
              label="Equipment"
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleFormChange}
              options={(equipment || []).map(e => ({
                value: e.id,
                label: e.name,
              }))}
              placeholder="Select equipment"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                name="rentalStartDate"
                type="date"
                value={formData.rentalStartDate}
                onChange={handleFormChange}
                required
              />
              <Input
                label="End Date"
                name="rentalEndDate"
                type="date"
                value={formData.rentalEndDate}
                onChange={handleFormChange}
                required
              />
            </div>
            <Input
              label="Rental Rate (₹)"
              name="rentalRate"
              type="number"
              value={formData.rentalRate}
              onChange={handleFormChange}
              placeholder="0.00"
              required
            />
            <Textarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              placeholder="Additional notes about this rental..."
              rows={3}
            />
          </Form>
        </Modal>
      </div>
    );
  }

export default RentalsPage;
