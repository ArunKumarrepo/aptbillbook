/**
 * Customers — Enterprise CRM Page
 */
import React, { useState } from "react";
import { useFetch } from "../hooks/useApi";
import customerService from "../services/customerService";
import { mockData } from "../utils/mockDataService";
import Modal from "../components/Modal";
import { Form, Input, Button, Textarea } from "../components/Form";
import Alert from "../components/Alert";
import logger from "../utils/logger";

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const EMPTY = { name:"", email:"", phone:"", address:"", city:"", state:"", pincode:"", notes:"" };

const CustomersPage = () => {
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [editingCustomer,  setEditingCustomer]  = useState(null);
  const [formData,         setFormData]         = useState(EMPTY);
  const [alerts,           setAlerts]           = useState([]);
  const [isSubmitting,     setIsSubmitting]     = useState(false);
  const [search,           setSearch]           = useState("");

  const { data: customers, loading, refetch } = useFetch(
    () => customerService.getCustomers({ limit: 50, offset: 0 }),
    mockData.customers
  );

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 5000);
  };
  const removeAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setFormData(customer ? { ...customer } : EMPTY);
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingCustomer(null); };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, formData);
        addAlert("success", "Updated", "Customer updated successfully");
      } else {
        await customerService.createCustomer(formData);
        addAlert("success", "Created", "Customer added successfully");
      }
      closeModal(); refetch();
    } catch (err) {
      addAlert("error", "Error", err.message || "Failed to save customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await customerService.deleteCustomer(id);
      addAlert("success", "Deleted", "Customer removed");
      refetch();
    } catch (err) {
      addAlert("error", "Error", err.message || "Failed to delete");
    }
  };

  const filtered = (customers || []).filter(c =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="pg">
      {alerts.length > 0 && (
        <div className="pg-alerts">
          {alerts.map(a => <Alert key={a.id} type={a.type} title={a.title} message={a.message} onClose={() => removeAlert(a.id)}/>)}
        </div>
      )}

      <div className="pg__topbar">
        <div>
          <h1 className="pg__title">Customers</h1>
          <p className="pg__subtitle">{(customers || []).length} total customers</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <PlusIcon/> New Customer
        </button>
      </div>

      <div className="kpi-strip">
        {[
          { label:"Total Customers", value:(customers||[]).length,                                                                color:"#4f8ef7" },
          { label:"Active",          value:(customers||[]).filter(c=>c.status!=="inactive").length,                               color:"#34c98a" },
          { label:"Cities Covered",  value:[...new Set((customers||[]).map(c=>c.city).filter(Boolean))].length,                  color:"#9b6cf7" },
        ].map((k,i) => (
          <div key={i} className="kpi">
            <div className="kpi__icon" style={{ background:k.color+"18", color:k.color }}><UserIcon/></div>
            <p className="kpi__value">{k.value}</p>
            <p className="kpi__label">{k.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="pg-loading"><div className="pg-spinner"/><p className="pg-loading__text">Loading customers</p></div>
      ) : (
        <div className="dt-wrap">
          <div className="dt-toolbar">
            <div className="dt-search">
              <SearchIcon/>
              <input placeholder="Search customers" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <span className="dt-count">{filtered.length} record{filtered.length!==1?"s":""}</span>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 24px", color:"#94a3b8" }}>
              <p style={{ fontSize:14 }}>No customers found</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight:600, color:"#1e293b" }}>{c.name}</td>
                    <td style={{ color:"#64748b" }}>{c.email||"—"}</td>
                    <td>{c.phone}</td>
                    <td>{c.city||"—"}</td>
                    <td>
                      <span className={`badge badge--${c.status==="inactive"?"inactive":"active"}`}>
                        {c.status||"active"}
                      </span>
                    </td>
                    <td>
                      <button className="tbl-action tbl-action--blue"  onClick={() => openModal(c)}>Edit</button>
                      <button className="tbl-action tbl-action--red"   onClick={() => handleDelete(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} title={editingCustomer?"Edit Customer":"New Customer"} onClose={closeModal} size="lg"
        footer={<>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
            {editingCustomer?"Update":"Create"}
          </Button>
        </>}
      >
        <Form onSubmit={handleSubmit}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
            <Input label="Full Name" name="name"    value={formData.name}    onChange={handleChange} placeholder="Ramesh Kumar"       required/>
            <Input label="Email"     name="email"   type="email" value={formData.email}   onChange={handleChange} placeholder="ramesh@example.com"/>
            <Input label="Phone"     name="phone"   value={formData.phone}   onChange={handleChange} placeholder="+91 98765 43210"    required/>
            <Input label="City"      name="city"    value={formData.city}    onChange={handleChange} placeholder="Chennai"/>
            <Input label="Address"   name="address" value={formData.address} onChange={handleChange} placeholder="123 Main Street"/>
            <Input label="State"     name="state"   value={formData.state}   onChange={handleChange} placeholder="Tamil Nadu"/>
            <Input label="Pincode"   name="pincode" value={formData.pincode} onChange={handleChange} placeholder="600001"/>
          </div>
          <Textarea label="Notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional notes" rows={3}/>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomersPage;
