/**
 * Inventory Management Page
 * Equipment and stock management
 */

import React, { useState } from 'react';
import { useFetch } from '../hooks/useApi';
import inventoryService from '../services/inventoryService';
import barcodeService from '../services/barcodeService';
import { mockData } from '../utils/mockDataService';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Form, Input, Select, Textarea, Button } from '../components/Form';
import Alert from '../components/Alert';
import logger from '../utils/logger';

const InventoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    quantity: '',
    minStock: '',
    rentalRate: '',
    purchasePrice: '',
    status: 'available',
  });

  // Fetch data with demo fallbacks
  const { data: equipment, loading, refetch } = useFetch(
    () => inventoryService.getEquipment({ limit: 50 }),
    mockData.equipment
  );

  const { data: lowStock } = useFetch(
    () => inventoryService.getLowStockItems(),
    mockData.equipment.filter(e => e.quantity <= e.minStock)
  );

  const { data: categories } = useFetch(
    () => inventoryService.getCategories(),
    mockData.categories
  );

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: '',
        description: '',
        quantity: '',
        minStock: '',
        rentalRate: '',
        purchasePrice: '',
        status: 'available',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
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
      if (editingItem) {
        await inventoryService.updateEquipment(editingItem.id, formData);
        addAlert('success', 'Success', 'Equipment updated successfully');
        logger.info('Equipment updated', { itemId: editingItem.id });
      } else {
        await inventoryService.addEquipment(formData);
        addAlert('success', 'Success', 'Equipment added successfully');
        logger.info('Equipment added', { name: formData.name });
      }
      handleCloseModal();
      refetch();
    } catch (error) {
      addAlert('error', 'Error', error.message || 'Failed to save equipment');
      logger.error('Equipment save error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintBarcode = (item) => {
    try {
      const barcode = barcodeService.generateBarcode(item.id, {
        width: 2,
        height: 50,
        format: 'code128',
      });
      logger.info('Barcode printed', { itemId: item.id, itemName: item.name });
      addAlert('success', 'Success', `Barcode printed for ${item.name}`);
      barcodeService.printBarcode(barcode);
    } catch (error) {
      addAlert('error', 'Error', 'Failed to print barcode');
      logger.error('Barcode print error', error);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;

    try {
      await inventoryService.deleteEquipment(id);
      addAlert('success', 'Success', 'Equipment deleted successfully');
      logger.info('Equipment deleted', { itemId: id });
      refetch();
    } catch (error) {
      addAlert('error', 'Error', error.message || 'Failed to delete equipment');
      logger.error('Equipment delete error', error);
    }
  };

  const columns = [
    { key: 'name', label: 'Equipment Name' },
    { key: 'category', label: 'Category' },
    { 
      key: 'quantity', 
      label: 'Stock',
      render: (val, row) => (
        <span className={val <= row.minStock ? 'text-red-600 font-bold' : ''}>
          {val} {val <= row.minStock && '⚠️'}
        </span>
      )
    },
    { 
      key: 'rentalRate', 
      label: 'Rental Rate',
      render: (val) => `₹${val?.toLocaleString()}/day`
    },
    { 
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          val === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {val}
        </span>
      )
    },
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
            onClick={() => handlePrintBarcode(row)}
            className="text-green-600 hover:text-green-800 underline text-sm"
          >
            Barcode
          </button>
          <button
            onClick={() => handleDeleteItem(row.id)}
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
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-600 mt-1">Manage equipment and stock levels</p>
          </div>
          <Button onClick={() => handleOpenModal()} variant="primary">
            ➕ Add Equipment
          </Button>
        </div>

        {/* Low Stock Alert */}
        {lowStock && lowStock.length > 0 && (
          <Alert
            type="warning"
            title="Low Stock Items"
            message={`${lowStock.length} item(s) are running low on stock`}
          />
        )}

        {/* Table */}
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p>Loading inventory...</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={equipment || []}
            searchable={true}
            sortable={true}
            pageSize={10}
          />
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          title={editingItem ? 'Edit Equipment' : 'Add Equipment'}
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
                {editingItem ? 'Update' : 'Add'}
              </Button>
            </>
          }
        >
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Equipment Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., Power Drill"
                required
              />
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                options={(categories || []).map(c => ({
                  value: c.id,
                  label: c.name,
                }))}
                placeholder="Select category"
                required
              />
              <Input
                label="Current Stock"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleFormChange}
                placeholder="0"
                required
              />
              <Input
                label="Minimum Stock Level"
                name="minStock"
                type="number"
                value={formData.minStock}
                onChange={handleFormChange}
                placeholder="5"
                required
              />
              <Input
                label="Daily Rental Rate (₹)"
                name="rentalRate"
                type="number"
                value={formData.rentalRate}
                onChange={handleFormChange}
                placeholder="500"
                required
              />
              <Input
                label="Purchase Price (₹)"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={handleFormChange}
                placeholder="10000"
              />
            </div>
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Equipment details and specifications..."
              rows={3}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'maintenance', label: 'Under Maintenance' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Form>
        </Modal>
      </div>
    );
  };

  export default InventoryPage;
