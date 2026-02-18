/**
 * Rentals — Enterprise Management Page
 */
import React, { useState } from "react";
import { useFetch } from "../hooks/useApi";
import rentalService from "../services/rentalService";
import customerService from "../services/customerService";
import inventoryService from "../services/inventoryService";
import { mockData } from "../utils/mockDataService";
import Modal from "../components/Modal";
import { Form, Input, Select, Button, Textarea } from "../components/Form";
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
const BoxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);

const EMPTY = { customerId:"", equipmentId:"", rentalStartDate:"", rentalEndDate:"", rentalRate:"", notes:"" };

const statusClass = (s) => {
  if (!s) return "badge--pending";
  if (s === "active") return "badge--active";
  if (s === "returned") return "badge--returned";
  return "badge--pending";
};

const RentalsPage = () => {
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [editingRental, setEditingRental] = useState(null);
  const [formData,     setFormData]     = useState(EMPTY);
  const [alerts,       setAlerts]       = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search,       setSearch]       = useState("");

  const { data: rentals,   loading, refetch } = useFetch(() => rentalService.getRentals({ limit:50, offset:0 }), mockData.rentals);
  const { data: customers }                   = useFetch(() => customerService.getCustomers({ limit:100 }), mockData.customers);
  const { data: equipment }                   = useFetch(() => inventoryService.getEquipment({ limit:100 }), mockData.equipment);

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 5000);
  };
  const removeAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  const openModal = (rental = null) => {
    setEditingRental(rental);
    setFormData(rental ? { ...rental } : EMPTY);
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingRental(null); };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingRental) {
        await rentalService.updateRental(editingRental.id, formData);
        addAlert("success", "Updated", "Rental updated successfully");
      } else {
        await rentalService.createRental(formData);
        addAlert("success", "Created", "Rental created successfully");
      }
      closeModal(); refetch();
    } catch (err) {
      addAlert("error", "Error", err.message || "Failed to save rental");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      await rentalService.returnRental(id, { returnDate: new Date() });
      addAlert("success", "Returned", "Equipment returned successfully");
      refetch();
    } catch (err) {
      addAlert("error", "Error", err.message || "Failed to return equipment");
    }
  };

  const filtered = (rentals || []).filter(r =>
    !search ||
    r.rentalNumber?.toLowerCase().includes(search.toLowerCase()) ||
    r.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.equipment?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total:   (rentals||[]).length,
    active:  (rentals||[]).filter(r=>r.status==="active").length,
    returned:(rentals||[]).filter(r=>r.status==="returned").length,
  };

  return (
    <div className="pg">
      {alerts.length > 0 && (
        <div className="pg-alerts">
          {alerts.map(a => <Alert key={a.id} type={a.type} title={a.title} message={a.message} onClose={() => removeAlert(a.id)}/>)}
        </div>
      )}

      <div className="pg__topbar">
        <div>
          <h1 className="pg__title">Rentals</h1>
          <p className="pg__subtitle">Track equipment rentals and returns</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <PlusIcon/> New Rental
        </button>
      </div>

      <div className="kpi-strip">
        {[
          { label:"Total Rentals",  value:counts.total,   color:"#4f8ef7" },
          { label:"Active",         value:counts.active,  color:"#34c98a" },
          { label:"Returned",       value:counts.returned,color:"#9b6cf7" },
        ].map((k,i) => (
          <div key={i} className="kpi">
            <div className="kpi__icon" style={{ background:k.color+"18", color:k.color }}><BoxIcon/></div>
            <p className="kpi__value">{k.value}</p>
            <p className="kpi__label">{k.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="pg-loading"><div className="pg-spinner"/><p className="pg-loading__text">Loading rentals</p></div>
      ) : (
        <div className="dt-wrap">
          <div className="dt-toolbar">
            <div className="dt-search">
              <SearchIcon/>
              <input placeholder="Search by rental #, customer, equipment" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <span className="dt-count">{filtered.length} record{filtered.length!==1?"s":""}</span>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 24px", color:"#94a3b8" }}>
              <p style={{ fontSize:14 }}>No rentals found</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Rental #</th><th>Customer</th><th>Equipment</th>
                  <th>Start</th><th>End</th><th>Rate</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight:600, color:"#1e293b", fontFamily:"monospace", fontSize:13 }}>{r.rentalNumber}</td>
                    <td style={{ fontWeight:500 }}>{r.customer?.name||"—"}</td>
                    <td style={{ color:"#64748b" }}>{r.equipment?.name||"—"}</td>
                    <td style={{ color:"#64748b", fontSize:12 }}>{r.startDate||r.rentalStartDate||"—"}</td>
                    <td style={{ color:"#64748b", fontSize:12 }}>{r.endDate||r.rentalEndDate||"—"}</td>
                    <td style={{ fontWeight:600 }}>₹{Number(r.rentalRate||0).toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`badge ${statusClass(r.status)}`}>{r.status||"pending"}</span>
                    </td>
                    <td>
                      <button className="tbl-action tbl-action--blue" onClick={() => openModal(r)}>Edit</button>
                      {r.status !== "returned" && (
                        <button className="tbl-action tbl-action--green" onClick={() => handleReturn(r.id)}>Return</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} title={editingRental?"Edit Rental":"New Rental"} onClose={closeModal} size="lg"
        footer={<>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
            {editingRental?"Update":"Create"}
          </Button>
        </>}
      >
        <Form onSubmit={handleSubmit}>
          <Select label="Customer" name="customerId" value={formData.customerId} onChange={handleChange}
            options={(customers||[]).map(c=>({ value:c.id, label:c.name }))} placeholder="Select customer" required/>
          <Select label="Equipment" name="equipmentId" value={formData.equipmentId} onChange={handleChange}
            options={(equipment||[]).map(e=>({ value:e.id, label:e.name }))} placeholder="Select equipment" required/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
            <Input label="Start Date" name="rentalStartDate" type="date" value={formData.rentalStartDate} onChange={handleChange} required/>
            <Input label="End Date"   name="rentalEndDate"   type="date" value={formData.rentalEndDate}   onChange={handleChange} required/>
          </div>
          <Input label="Rental Rate (₹)" name="rentalRate" type="number" value={formData.rentalRate} onChange={handleChange} placeholder="0.00" required/>
          <Textarea label="Notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes about this rental" rows={3}/>
        </Form>
      </Modal>
    </div>
  );
};

export default RentalsPage;
