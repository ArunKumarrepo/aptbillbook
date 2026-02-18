/**
 * Inventory — Enterprise Equipment Management
 */
import React, { useState } from "react";
import { useFetch } from "../hooks/useApi";
import inventoryService from "../services/inventoryService";
import barcodeService from "../services/barcodeService";
import { mockData } from "../utils/mockDataService";
import Modal from "../components/Modal";
import { Form, Input, Select, Textarea, Button } from "../components/Form";
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
const ToolIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);
const WarnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const EMPTY = { name:"", category:"", description:"", quantity:"", minStock:"", rentalRate:"", purchasePrice:"", status:"available" };

const statusClass = (s) => {
  if (s === "available") return "badge--active";
  if (s === "rented")    return "badge--pending";
  if (s === "maintenance") return "badge--overdue";
  return "badge--inactive";
};

const InventoryPage = () => {
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [editingItem,  setEditingItem]  = useState(null);
  const [formData,     setFormData]     = useState(EMPTY);
  const [alerts,       setAlerts]       = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("all");

  const { data: equipment, loading, refetch } = useFetch(
    () => inventoryService.getEquipment({ limit:50 }),
    mockData.equipment
  );
  const { data: lowStock } = useFetch(
    () => inventoryService.getLowStockItems(),
    (mockData.equipment||[]).filter(e => e.quantity <= e.minStock)
  );
  const { data: categories } = useFetch(
    () => inventoryService.getCategories(),
    mockData.categories
  );

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 5000);
  };
  const removeAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item ? { ...item } : EMPTY);
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingItem(null); };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await inventoryService.updateEquipment(editingItem.id, formData);
        addAlert("success", "Updated", "Equipment updated");
      } else {
        await inventoryService.createEquipment(formData);
        addAlert("success", "Created", "Equipment added to inventory");
      }
      closeModal(); refetch();
    } catch (err) {
      addAlert("error", "Error", err.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this item from inventory?")) return;
    try {
      await inventoryService.deleteEquipment(id);
      addAlert("success", "Removed", "Item removed from inventory");
      refetch();
    } catch (err) {
      addAlert("error", "Error", err.message || "Failed to delete");
    }
  };

  const handleBarcode = async (item) => {
    try {
      barcodeService.generateBarcode(item.serialNumber || item.id);
      addAlert("success", "Barcode", "Barcode generated for " + item.name);
    } catch (err) {
      addAlert("error", "Error", "Failed to generate barcode");
    }
  };

  const cats = [...new Set((equipment||[]).map(e => e.category).filter(Boolean))];
  const filtered = (equipment||[]).filter(e =>
    (catFilter === "all" || e.category === catFilter) &&
    (!search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.category?.toLowerCase().includes(search.toLowerCase()))
  );

  const avail = (equipment||[]).filter(e=>e.status==="available").length;
  const rented = (equipment||[]).filter(e=>e.status==="rented").length;
  const low  = (lowStock||[]).length;

  return (
    <div className="pg">
      {alerts.length > 0 && (
        <div className="pg-alerts">
          {alerts.map(a => <Alert key={a.id} type={a.type} title={a.title} message={a.message} onClose={() => removeAlert(a.id)}/>)}
        </div>
      )}

      <div className="pg__topbar">
        <div>
          <h1 className="pg__title">Inventory</h1>
          <p className="pg__subtitle">Equipment and tool stock management</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <PlusIcon/> Add Equipment
        </button>
      </div>

      <div className="kpi-strip">
        {[
          { label:"Total Items",  value:(equipment||[]).length, color:"#4f8ef7" },
          { label:"Available",    value:avail,                  color:"#34c98a" },
          { label:"Currently Rented", value:rented,            color:"#9b6cf7" },
          { label:"Low Stock",    value:low,                    color:"#ef4444" },
        ].map((k,i) => (
          <div key={i} className="kpi">
            <div className="kpi__icon" style={{ background:k.color+"18", color:k.color }}>
              {i===3 ? <WarnIcon/> : <ToolIcon/>}
            </div>
            <p className="kpi__value">{k.value}</p>
            <p className="kpi__label">{k.label}</p>
          </div>
        ))}
      </div>

      {low > 0 && (
        <div style={{ display:"flex", alignItems:"center", gap:"12px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"12px 16px" }}>
          <span style={{ color:"#ef4444" }}><WarnIcon/></span>
          <span style={{ fontSize:13.5, fontWeight:500, color:"#b91c1c" }}>
            {low} item{low!==1?"s":""} below minimum stock level — reorder required
          </span>
        </div>
      )}

      {loading ? (
        <div className="pg-loading"><div className="pg-spinner"/><p className="pg-loading__text">Loading inventory</p></div>
      ) : (
        <div className="dt-wrap">
          <div className="dt-toolbar">
            <div className="dt-search">
              <SearchIcon/>
              <input placeholder="Search equipment" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
              {["all", ...cats].map(c => (
                <button key={c} onClick={() => setCatFilter(c)}
                  style={{
                    padding:"5px 12px", borderRadius:5, border:"1px solid",
                    fontSize:12, fontWeight:500, cursor:"pointer",
                    background: catFilter===c ? "#4f8ef7" : "white",
                    color: catFilter===c ? "white" : "#64748b",
                    borderColor: catFilter===c ? "#4f8ef7" : "#e2e8f0",
                    transition:"all 0.15s",
                  }}
                >{c==="all"?"All":c}</button>
              ))}
            </div>
            <span className="dt-count">{filtered.length} item{filtered.length!==1?"s":""}</span>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 24px", color:"#94a3b8" }}>
              <p style={{ fontSize:14 }}>No items found</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Category</th><th>Qty</th>
                  <th>Min Stock</th><th>Rental Rate</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const isLow = item.quantity <= item.minStock;
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight:600, color:"#1e293b" }}>
                        {item.name}
                        {isLow && <span style={{ marginLeft:6, fontSize:10, background:"#fee2e2", color:"#ef4444", padding:"2px 5px", borderRadius:3, fontWeight:700 }}>LOW</span>}
                      </td>
                      <td style={{ color:"#64748b" }}>{item.category||"—"}</td>
                      <td style={{ fontWeight:700, color: isLow ? "#ef4444" : "#0f172a" }}>{item.quantity}</td>
                      <td style={{ color:"#94a3b8" }}>{item.minStock||0}</td>
                      <td style={{ fontWeight:600 }}>₹{Number(item.rentalRate||0).toLocaleString("en-IN")}/day</td>
                      <td><span className={`badge ${statusClass(item.status)}`}>{item.status||"available"}</span></td>
                      <td>
                        <button className="tbl-action tbl-action--blue"   onClick={() => openModal(item)}>Edit</button>
                        <button className="tbl-action tbl-action--green"  onClick={() => handleBarcode(item)}>Barcode</button>
                        <button className="tbl-action tbl-action--red"    onClick={() => handleDelete(item.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} title={editingItem?"Edit Equipment":"Add Equipment"} onClose={closeModal} size="lg"
        footer={<>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
            {editingItem?"Update":"Add"}
          </Button>
        </>}
      >
        <Form onSubmit={handleSubmit}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
            <Input label="Equipment Name" name="name"    value={formData.name}          onChange={handleChange} placeholder="Concrete Drill" required/>
            <Input label="Category"       name="category" value={formData.category}     onChange={handleChange} placeholder="Power Tools"/>
            <Input label="Quantity"       name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="10" required/>
            <Input label="Min Stock"      name="minStock" type="number" value={formData.minStock} onChange={handleChange} placeholder="2"/>
            <Input label="Rental Rate/Day (₹)" name="rentalRate" type="number" value={formData.rentalRate} onChange={handleChange} placeholder="500"/>
            <Input label="Purchase Price (₹)"  name="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleChange} placeholder="15000"/>
          </div>
          <Select label="Status" name="status" value={formData.status} onChange={handleChange}
            options={[
              { value:"available",   label:"Available" },
              { value:"rented",      label:"Rented Out" },
              { value:"maintenance", label:"Under Maintenance" },
              { value:"retired",     label:"Retired" },
            ]}/>
          <Textarea label="Description" name="description" value={formData.description} onChange={handleChange}
            placeholder="Detailed description of the equipment" rows={3}/>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
