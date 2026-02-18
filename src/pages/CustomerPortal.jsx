/**
 * Customer Portal — Self-Service Dashboard
 */
import React, { useState } from "react";
import { useFetch } from "../hooks/useApi";
import customerService from "../services/customerService";
import billingService from "../services/billingService";
import { mockData } from "../utils/mockDataService";
import Alert from "../components/Alert";

const UserIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const BoxIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);
const InvIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
  </svg>
);

const statusClass = (s) => {
  if (!s)               return "badge--pending";
  if (s === "active" || s === "paid") return "badge--active";
  if (s === "returned") return "badge--returned";
  if (s === "overdue")  return "badge--overdue";
  return "badge--pending";
};

const CustomerPortal = ({ customerId = "1" }) => {
  const [activeTab, setActiveTab] = useState("rentals");
  const [alerts, setAlerts] = useState([]);

  const { data: customer, loading: custLoading } = useFetch(
    () => customerService.getCustomer(customerId),
    mockData.customers[0]
  );
  const { data: rentals, loading: rentLoading } = useFetch(
    () => customerService.getCustomerRentals(customerId, { limit:50 }),
    (mockData.rentals||[]).slice(0, 3)
  );
  const { data: invoices, loading: invLoading } = useFetch(
    () => customerService.getCustomerBilling(customerId, { limit:50 }),
    (mockData.invoices||[]).slice(0, 3)
  );

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 5000);
  };
  const removeAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  const totalBilled   = (invoices||[]).reduce((s, inv) => s + (inv.amount||0), 0);
  const totalPaid     = (invoices||[]).reduce((s, inv) => s + (inv.paidAmount||0), 0);
  const outstanding   = totalBilled - totalPaid;
  const activeRentals = (rentals||[]).filter(r => r.status === "active").length;

  if (custLoading) {
    return (
      <div className="pg-loading"><div className="pg-spinner"/><p className="pg-loading__text">Loading your portal</p></div>
    );
  }

  return (
    <div className="pg" style={{ maxWidth:900, margin:"0 auto" }}>
      {alerts.length > 0 && (
        <div className="pg-alerts">
          {alerts.map(a => <Alert key={a.id} type={a.type} title={a.title} message={a.message} onClose={() => removeAlert(a.id)}/>)}
        </div>
      )}

      {/* Profile card */}
      <div className="card" style={{ display:"flex", alignItems:"center", gap:20 }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:"#eff6ff", color:"#4f8ef7", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <UserIcon/>
        </div>
        <div style={{ flex:1 }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"#0f172a", margin:"0 0 3px" }}>{customer?.name||"Customer"}</h1>
          <p style={{ fontSize:13, color:"#64748b", margin:0 }}>{customer?.email||""} {customer?.phone ? " "+customer.phone : ""}</p>
          {customer?.city && <p style={{ fontSize:12, color:"#94a3b8", margin:"2px 0 0" }}>{customer.city}{customer.state ? ", "+customer.state : ""}</p>}
        </div>
        <div style={{ display:"flex", gap:24, textAlign:"center" }}>
          {[
            { label:"Rentals",     value:(rentals||[]).length },
            { label:"Active Now",  value:activeRentals },
            { label:"Invoices",    value:(invoices||[]).length },
          ].map((s,i) => (
            <div key={i}>
              <p style={{ fontSize:20, fontWeight:700, color:"#0f172a", margin:0 }}>{s.value}</p>
              <p style={{ fontSize:11, color:"#94a3b8", margin:"2px 0 0", textTransform:"uppercase", letterSpacing:"0.4px" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Financial summary */}
      <div className="kpi-strip">
        {[
          { label:"Total Billed",   value:`₹${totalBilled.toLocaleString("en-IN")}`,   color:"#4f8ef7" },
          { label:"Paid",           value:`₹${totalPaid.toLocaleString("en-IN")}`,      color:"#34c98a" },
          { label:"Outstanding",    value:`₹${outstanding.toLocaleString("en-IN")}`,    color: outstanding > 0 ? "#ef4444" : "#34c98a" },
          { label:"Active Rentals", value:activeRentals,                                color:"#9b6cf7" },
        ].map((k,i) => (
          <div key={i} className="kpi">
            <div className="kpi__icon" style={{ background:k.color+"18", color:k.color }}>
              {i < 3 ? <InvIcon/> : <BoxIcon/>}
            </div>
            <p className="kpi__value">{k.value}</p>
            <p className="kpi__label">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom:"2px solid #f1f5f9" }}>
        {[
          { id:"rentals",  label:"My Rentals",  icon:<BoxIcon/> },
          { id:"invoices", label:"My Invoices", icon:<InvIcon/> },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display:"inline-flex", alignItems:"center", gap:7,
            padding:"10px 20px", border:"none", background:"transparent",
            fontSize:13.5, fontWeight: activeTab===tab.id ? 600 : 500,
            color: activeTab===tab.id ? "#4f8ef7" : "#64748b",
            borderBottom: activeTab===tab.id ? "2px solid #4f8ef7" : "2px solid transparent",
            marginBottom:-2, cursor:"pointer", transition:"all 0.15s",
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "rentals" && (
        <div className="dt-wrap">
          {rentLoading ? (
            <div className="pg-loading"><div className="pg-spinner"/><p className="pg-loading__text">Loading rentals</p></div>
          ) : (rentals||[]).length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 24px", color:"#94a3b8" }}>
              <p style={{ fontSize:14 }}>No rentals yet</p>
              <p style={{ fontSize:12, marginTop:4, color:"#cbd5e1" }}>Your rental history will appear here</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr><th>Rental #</th><th>Equipment</th><th>Start</th><th>End</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {(rentals||[]).map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight:600, color:"#1e293b", fontFamily:"monospace", fontSize:13 }}>{r.rentalNumber}</td>
                    <td style={{ fontWeight:500 }}>{r.equipment?.name||"—"}</td>
                    <td style={{ color:"#64748b", fontSize:12 }}>{r.startDate||r.rentalStartDate||"—"}</td>
                    <td style={{ color:"#64748b", fontSize:12 }}>{r.endDate||r.rentalEndDate||"—"}</td>
                    <td style={{ fontWeight:700 }}>₹{Number(r.amount||r.rentalRate||0).toLocaleString("en-IN")}</td>
                    <td><span className={`badge ${statusClass(r.status)}`}>{r.status||"pending"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="dt-wrap">
          {invLoading ? (
            <div className="pg-loading"><div className="pg-spinner"/><p className="pg-loading__text">Loading invoices</p></div>
          ) : (invoices||[]).length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 24px", color:"#94a3b8" }}>
              <p style={{ fontSize:14 }}>No invoices yet</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr><th>Invoice #</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {(invoices||[]).map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight:600, color:"#1e293b", fontFamily:"monospace", fontSize:13 }}>{inv.invoiceNumber}</td>
                    <td style={{ fontWeight:700 }}>₹{Number(inv.amount||0).toLocaleString("en-IN")}</td>
                    <td style={{ color:"#34c98a", fontWeight:600 }}>₹{Number(inv.paidAmount||0).toLocaleString("en-IN")}</td>
                    <td style={{ color: (inv.amount||0)-(inv.paidAmount||0)>0 ? "#ef4444" : "#34c98a", fontWeight:600 }}>
                      ₹{Number((inv.amount||0)-(inv.paidAmount||0)).toLocaleString("en-IN")}
                    </td>
                    <td style={{ color:"#64748b", fontSize:12 }}>{inv.invoiceDate||"—"}</td>
                    <td><span className={`badge ${statusClass(inv.status)}`}>{inv.status||"pending"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;
