/**
 * Billing & Accounting — Enterprise Admin Page
 */
import React, { useState } from "react";
import { useFetch } from "../hooks/useApi";
import billingService from "../services/billingService";
import rentalService from "../services/rentalService";
import barcodeService from "../services/barcodeService";
import { mockData } from "../utils/mockDataService";
import Modal from "../components/Modal";
import { Input, Select, Button } from "../components/Form";
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
const InvoiceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

const statusClass = (s) => {
  if (!s) return "badge--pending";
  if (s === "paid")    return "badge--paid";
  if (s === "overdue") return "badge--overdue";
  return "badge--pending";
};

const BillingAdminPage = () => {
  const [isModalOpen,        setIsModalOpen]        = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice,    setSelectedInvoice]    = useState(null);
  const [alerts,             setAlerts]             = useState([]);
  const [isSubmitting,       setIsSubmitting]       = useState(false);
  const [search,             setSearch]             = useState("");
  const [paymentData, setPaymentData] = useState({ amount:"", paymentMethod:"cash", notes:"" });

  const { data: invoices, loading, refetch } = useFetch(
    () => billingService.getInvoices({ limit:50, offset:0 }),
    mockData.invoices
  );
  const { data: overdueData } = useFetch(
    () => billingService.getOverdueInvoices({ limit:10 }),
    mockData.overdue
  );
  const { data: summaryData } = useFetch(
    () => billingService.getBillingSummary({}),
    { totalOutstanding:6800, totalPaid:138200, overdueAmount:1800 }
  );
  const { data: rentals } = useFetch(
    () => rentalService.getRentals({ limit:100, status:"completed" }),
    mockData.rentals
  );

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 5000);
  };
  const removeAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData(e.target);
      await billingService.createInvoice(Object.fromEntries(fd));
      addAlert("success", "Invoice Created", "Invoice created successfully");
      setIsModalOpen(false); refetch();
    } catch (err) {
      addAlert("error", "Error", err.message || "Failed to create invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await billingService.recordPayment({ invoiceId:selectedInvoice.id, ...paymentData, paymentDate:new Date() });
      addAlert("success", "Payment Recorded", "Payment recorded successfully");
      setIsPaymentModalOpen(false);
      setPaymentData({ amount:"", paymentMethod:"cash", notes:"" });
      refetch();
    } catch (err) {
      addAlert("error", "Error", err.message || "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = async (invoiceId) => {
    try {
      const inv = (invoices||[]).find(i => i.id === invoiceId);
      barcodeService.generateBarcode(inv?.invoiceNumber);
      window.print();
      addAlert("success", "Ready to Print", "Invoice ready to print");
    } catch (err) {
      addAlert("error", "Error", "Failed to print invoice");
    }
  };

  const handleReminder = async (invoiceId) => {
    try {
      await billingService.sendInvoiceReminder(invoiceId);
      addAlert("success", "Reminder Sent", "Payment reminder sent");
    } catch (err) {
      addAlert("error", "Error", "Failed to send reminder");
    }
  };

  const filtered = (invoices||[]).filter(inv =>
    !search ||
    inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const summaryItems = [
    { label:"Total Outstanding", value:`₹${(summaryData?.totalOutstanding||0).toLocaleString("en-IN")}`, color:"#f5a623" },
    { label:"Total Collected",   value:`₹${(summaryData?.totalPaid||0).toLocaleString("en-IN")}`,         color:"#34c98a" },
    { label:"Overdue Amount",    value:`₹${(summaryData?.overdueAmount||0).toLocaleString("en-IN")}`,      color:"#ef4444" },
    { label:"Total Invoices",    value:(invoices||[]).length,                                              color:"#4f8ef7" },
  ];

  return (
    <div className="pg">
      {alerts.length > 0 && (
        <div className="pg-alerts">
          {alerts.map(a => <Alert key={a.id} type={a.type} title={a.title} message={a.message} onClose={() => removeAlert(a.id)}/>)}
        </div>
      )}

      <div className="pg__topbar">
        <div>
          <h1 className="pg__title">Billing & Accounting</h1>
          <p className="pg__subtitle">Manage invoices and payment collections</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusIcon/> New Invoice
        </button>
      </div>

      {/* KPI summary */}
      <div className="kpi-strip">
        {summaryItems.map((k,i) => (
          <div key={i} className="kpi">
            <div className="kpi__icon" style={{ background:k.color+"18", color:k.color }}><InvoiceIcon/></div>
            <p className="kpi__value">{k.value}</p>
            <p className="kpi__label">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Overdue banner */}
      {overdueData && overdueData.length > 0 && (
        <div style={{
          display:"flex", alignItems:"center", gap:"12px",
          background:"#fff7ed", border:"1px solid #fed7aa",
          borderRadius:8, padding:"12px 16px",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span style={{ fontSize:13.5, fontWeight:500, color:"#92400e" }}>
            {overdueData.length} overdue invoice{overdueData.length!==1?"s":""} — total ₹{overdueData.reduce((s,inv)=>s+(inv.amount-inv.paidAmount),0).toLocaleString("en-IN")} outstanding
          </span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="pg-loading"><div className="pg-spinner"/><p className="pg-loading__text">Loading invoices</p></div>
      ) : (
        <div className="dt-wrap">
          <div className="dt-toolbar">
            <div className="dt-search">
              <SearchIcon/>
              <input placeholder="Search by invoice #, customer" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <span className="dt-count">{filtered.length} invoice{filtered.length!==1?"s":""}</span>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 24px", color:"#94a3b8" }}>
              <p style={{ fontSize:14 }}>No invoices found</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th><th>Customer</th><th>Amount</th>
                  <th>Paid</th><th>Balance</th><th>Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight:600, color:"#1e293b", fontFamily:"monospace", fontSize:13 }}>{inv.invoiceNumber}</td>
                    <td style={{ fontWeight:500 }}>{inv.customer?.name||"—"}</td>
                    <td style={{ fontWeight:700 }}>₹{Number(inv.amount||0).toLocaleString("en-IN")}</td>
                    <td style={{ color:"#34c98a", fontWeight:600 }}>₹{Number(inv.paidAmount||0).toLocaleString("en-IN")}</td>
                    <td style={{ color:"#ef4444", fontWeight:600 }}>₹{Number((inv.amount||0)-(inv.paidAmount||0)).toLocaleString("en-IN")}</td>
                    <td style={{ color:"#64748b", fontSize:12 }}>{inv.invoiceDate||"—"}</td>
                    <td><span className={`badge ${statusClass(inv.status)}`}>{inv.status||"pending"}</span></td>
                    <td>
                      <button className="tbl-action tbl-action--green" onClick={() => handlePrint(inv.id)}>Print</button>
                      {inv.status !== "paid" && (
                        <>
                          <button className="tbl-action tbl-action--blue" onClick={() => { setSelectedInvoice(inv); setIsPaymentModalOpen(true); }}>Pay</button>
                          <button className="tbl-action tbl-action--orange" onClick={() => handleReminder(inv.id)}>Remind</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Create Invoice Modal */}
      <Modal isOpen={isModalOpen} title="Create Invoice" onClose={() => setIsModalOpen(false)} size="lg"
        footer={<>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button form="createInvoiceForm" variant="primary" loading={isSubmitting} disabled={isSubmitting}>Create Invoice</Button>
        </>}
      >
        <form id="createInvoiceForm" onSubmit={handleCreateInvoice} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>Select Rental</label>
            <select name="rentalId" required style={{ width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:6, fontSize:13, color:"#1e293b", outline:"none", background:"white" }}>
              <option value="">Choose a rental to invoice</option>
              {(rentals||[]).map(r => <option key={r.id} value={r.id}>{r.customer?.name||"?"} — {r.equipment?.name||"?"}</option>)}
            </select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
            <Input label="Invoice Date" name="invoiceDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} required/>
            <Input label="Due Date"     name="dueDate"     type="date" required/>
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={isPaymentModalOpen} title="Record Payment" onClose={() => setIsPaymentModalOpen(false)} size="md"
        footer={<>
          <Button variant="secondary" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
          <Button form="paymentForm" variant="primary" loading={isSubmitting} disabled={isSubmitting}>Record Payment</Button>
        </>}
      >
        <form id="paymentForm" onSubmit={handleRecordPayment} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          {selectedInvoice && (
            <div style={{ background:"#f8fafc", borderRadius:8, padding:"14px 16px", border:"1px solid #e2e8f0" }}>
              <p style={{ fontSize:12, color:"#64748b", margin:"0 0 4px" }}>Invoice: {selectedInvoice.invoiceNumber}</p>
              <p style={{ fontSize:20, fontWeight:700, color:"#0f172a", margin:0 }}>
                ₹{Number((selectedInvoice.amount||0)-(selectedInvoice.paidAmount||0)).toLocaleString("en-IN")} outstanding
              </p>
            </div>
          )}
          <Input label="Payment Amount (₹)" name="amount" type="number" value={paymentData.amount}
            onChange={e => setPaymentData(prev=>({...prev, amount:e.target.value}))} placeholder="0.00" required/>
          <Select label="Payment Method" name="paymentMethod" value={paymentData.paymentMethod}
            onChange={e => setPaymentData(prev=>({...prev, paymentMethod:e.target.value}))}
            options={[
              { value:"cash",          label:"Cash" },
              { value:"check",         label:"Cheque" },
              { value:"bank_transfer", label:"Bank Transfer" },
              { value:"credit_card",   label:"Credit Card" },
              { value:"upi",           label:"UPI" },
            ]} required/>
          <Input label="Reference / Notes" name="notes" value={paymentData.notes}
            onChange={e => setPaymentData(prev=>({...prev, notes:e.target.value}))} placeholder="Reference number, cheque number, etc."/>
        </form>
      </Modal>
    </div>
  );
};

export default BillingAdminPage;
