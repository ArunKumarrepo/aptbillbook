/**
 * Analytics Dashboard — Enterprise Reporting Page
 */
import React, { useState } from "react";
import { useFetch } from "../hooks/useApi";
import analyticsService from "../services/analyticsService";
import { mockData } from "../utils/mockDataService";

const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const TrendUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

/* Simple bar chart rendered in SVG */
const BarChart = ({ data, colors }) => {
  const W = 560; const H = 160; const pad = { t:10, r:10, b:30, l:40 };
  const iw = W-pad.l-pad.r; const ih = H-pad.t-pad.b;
  const max = Math.max(...data.map(d=>d.value), 1);
  const bw = iw / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      {[0,0.25,0.5,0.75,1].map((t,i) => (
        <line key={i} x1={pad.l} x2={pad.l+iw} y1={pad.t+t*ih} y2={pad.t+t*ih} stroke="#f1f5f9" strokeWidth="1"/>
      ))}
      {data.map((d,i) => {
        const bh = (d.value/max)*ih;
        const x = pad.l + i*bw + bw*0.15;
        const w = bw*0.7;
        return (
          <g key={i}>
            <rect x={x} y={pad.t+ih-bh} width={w} height={bh} rx="3"
              fill={colors ? colors[i % colors.length] : "#4f8ef7"} opacity="0.85"/>
            <text x={x+w/2} y={H-4} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* Line chart */
const LineChart = ({ values, color="#4f8ef7" }) => {
  const W=560; const H=140; const pad={t:10,r:10,b:20,l:40};
  const iw=W-pad.l-pad.r; const ih=H-pad.t-pad.b;
  const max=Math.max(...values)+5; const min=Math.min(...values)-5;
  const xs=values.map((_,i)=>pad.l+(i/(values.length-1))*iw);
  const ys=values.map(v=>pad.t+ih-((v-min)/(max-min))*ih);
  const path=xs.map((x,i)=>`${i===0?"M":"L"}${x},${ys[i]}`).join(" ");
  const area=`${path} L${xs[xs.length-1]},${pad.t+ih} L${pad.l},${pad.t+ih} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <linearGradient id="lgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0,0.5,1].map((t,i)=>(
        <line key={i} x1={pad.l} x2={pad.l+iw} y1={pad.t+t*ih} y2={pad.t+t*ih} stroke="#f1f5f9" strokeWidth="1"/>
      ))}
      <path d={area} fill="url(#lgrad)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {xs.map((x,i)=>(
        <circle key={i} cx={x} cy={ys[i]} r="3" fill={color} stroke="white" strokeWidth="1.5"/>
      ))}
    </svg>
  );
};

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("month");

  const { data: revenueData,   loading: revenueLoading }   = useFetch(() => analyticsService.getRevenueAnalytics({ period:timeRange }),    mockData.revenueAnalytics);
  const { data: rentalData }                               = useFetch(() => analyticsService.getRentalAnalytics({ period:timeRange }),      { totalRentals:187, activeRentals:23, avgDuration:5.2, trend:8 });
  const { data: customerData }                             = useFetch(() => analyticsService.getCustomerAnalytics({ period:timeRange }),    { totalCustomers:42,  newCustomers:5, avgLTV:8500, retentionRate:92 });
  const { data: equipmentData }                            = useFetch(() => analyticsService.getEquipmentUtilization({ period:timeRange }), { totalEquipment:4, avgUtilization:78, revenuePerEquipment:36250, maintenanceCost:5000 });
  const { data: financialData }                            = useFetch(() => analyticsService.getFinancialSummary({ period:timeRange }),     { totalRevenue:145000, totalExpenses:25000, netProfit:120000, profitMargin:82.75 });

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const revValues = [38,52,45,61,68,57,73,80,72,84,88,81];
  const rentalBar = months.slice(0,6).map((l,i)=>({ label:l, value:[12,18,15,22,19,25][i] }));
  const catBar = [
    { label:"Drills",   value:45 },
    { label:"Mixers",   value:30 },
    { label:"Cutters",  value:25 },
    { label:"Lifts",    value:20 },
    { label:"Pumps",    value:15 },
  ];
  const catColors = ["#4f8ef7","#34c98a","#f5a623","#9b6cf7","#ef4444"];

  const sections = [
    {
      title:"Revenue Analytics",
      sub:"Monthly revenue performance",
      items:[
        { label:"Total Revenue",    value:`₹${(financialData?.totalRevenue||145000).toLocaleString("en-IN")}`,     color:"#4f8ef7", pct:85, trend:12.5 },
        { label:"Net Profit",       value:`₹${(financialData?.netProfit||120000).toLocaleString("en-IN")}`,         color:"#34c98a", pct:80, trend:9.2 },
        { label:"Profit Margin",    value:`${(financialData?.profitMargin||82.75).toFixed(1)}%`,                    color:"#9b6cf7", pct:82 },
        { label:"Total Expenses",   value:`₹${(financialData?.totalExpenses||25000).toLocaleString("en-IN")}`,      color:"#f5a623", pct:30 },
      ],
    },
    {
      title:"Rental Performance",
      sub:"Equipment utilization metrics",
      items:[
        { label:"Total Rentals",    value:rentalData?.totalRentals||187,                    color:"#4f8ef7", pct:70, trend:8 },
        { label:"Active Rentals",   value:rentalData?.activeRentals||23,                    color:"#34c98a", pct:60 },
        { label:"Avg Duration",     value:`${rentalData?.avgDuration||5.2} days`,            color:"#9b6cf7", pct:52 },
        { label:"Utilization Rate", value:`${equipmentData?.avgUtilization||78}%`,           color:"#f5a623", pct:equipmentData?.avgUtilization||78 },
      ],
    },
    {
      title:"Customer Analytics",
      sub:"Customer base health",
      items:[
        { label:"Total Customers",  value:customerData?.totalCustomers||42,                 color:"#4f8ef7", pct:65 },
        { label:"New This Period",  value:customerData?.newCustomers||5,                    color:"#34c98a", pct:40, trend:5 },
        { label:"Avg LTV",          value:`₹${(customerData?.avgLTV||8500).toLocaleString("en-IN")}`, color:"#9b6cf7", pct:72 },
        { label:"Retention Rate",   value:`${customerData?.retentionRate||92}%`,             color:"#f5a623", pct:customerData?.retentionRate||92 },
      ],
    },
  ];

  return (
    <div className="pg">
      <div className="pg__topbar">
        <div>
          <h1 className="pg__title">Analytics & Reports</h1>
          <p className="pg__subtitle">Business intelligence and performance insights</p>
        </div>
        <div style={{ display:"flex", gap:0, border:"1px solid #e2e8f0", borderRadius:8, overflow:"hidden", background:"white" }}>
          {["day","week","month","year"].map(r => (
            <button key={r} onClick={() => setTimeRange(r)} style={{
              padding:"7px 16px", border:"none",
              background: timeRange===r ? "#4f8ef7" : "transparent",
              color: timeRange===r ? "white" : "#64748b",
              fontWeight: timeRange===r ? 600 : 500,
              fontSize:13, cursor:"pointer",
              borderRight:"1px solid #e2e8f0",
              transition:"all 0.15s",
            }}>{r.charAt(0).toUpperCase()+r.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Revenue trend + category breakdown */}
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:16 }}>
        <div className="card">
          <div className="card__head">
            <div>
              <h3 className="card__title">Revenue Trend</h3>
              <p className="card__sub">Monthly revenue performance this year</p>
            </div>
          </div>
          {revenueLoading
            ? <div style={{ height:140, display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", fontSize:13 }}>Loading</div>
            : <LineChart values={revValues}/>}
        </div>
        <div className="card">
          <div className="card__head">
            <div>
              <h3 className="card__title">Equipment Mix</h3>
              <p className="card__sub">Revenue by category</p>
            </div>
          </div>
          <BarChart data={catBar} colors={catColors}/>
        </div>
      </div>

      {/* Rental bar */}
      <div className="card">
        <div className="card__head">
          <div>
            <h3 className="card__title">Rental Volume</h3>
            <p className="card__sub">Number of rentals per month (last 6 months)</p>
          </div>
        </div>
        <BarChart data={rentalBar} colors={["#4f8ef7"]}/>
      </div>

      {/* Metric sections */}
      {sections.map((sec, si) => (
        <div key={si} className="card">
          <div className="card__head">
            <div>
              <h3 className="card__title">{sec.title}</h3>
              <p className="card__sub">{sec.sub}</p>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:20 }}>
            {sec.items.map((item, ii) => (
              <div key={ii}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
                  <span style={{ fontSize:13, color:"#475569", fontWeight:500 }}>{item.label}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>{item.value}</span>
                    {item.trend !== undefined && (
                      <span style={{ display:"inline-flex", alignItems:"center", gap:3, fontSize:11, fontWeight:600, color:"#16a34a", background:"#dcfce7", padding:"2px 6px", borderRadius:4 }}>
                        <TrendUpIcon/>{item.trend}%
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ height:5, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${item.pct}%`, background:item.color, borderRadius:3, transition:"width 0.6s ease" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <style>{`
        @media (max-width: 1024px) {
          .pg > div[style*="grid-template-columns: 3fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;
