/**
 * Admin Dashboard - Professional Enterprise UI
 * Clean stats, line-chart visualization, metrics table, overdue invoices
 */

import React, { useState } from 'react';
import { useFetch } from '../hooks/useApi';
import { useLanguage } from '../i18n/LanguageContext';
import analyticsService from '../services/analyticsService';
import rentalService from '../services/rentalService';
import billingService from '../services/billingService';
import { mockData } from '../utils/mockDataService';
import Alert from '../components/Alert';

/* ₹”€₹”€ Inline SVG icons ₹”€₹”€ */
const Icon = {
  revenue: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  rentals: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  pending: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  customers: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  trendUp: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  trendDown: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [timeRange, setTimeRange] = useState('month');

  const { data: dashboardData, loading: dashLoading, error: dashError } = useFetch(
    () => analyticsService.getDashboardOverview({ period: timeRange }),
    mockData.dashboardOverview
  );
  const { data: revenueData, loading: revenueLoading } = useFetch(
    () => analyticsService.getRevenueAnalytics({ period: timeRange }),
    mockData.revenueAnalytics
  );
  const { data: rentalStats, loading: statsLoading } = useFetch(
    () => rentalService.getRentalStats({}),
    mockData.rentalStats
  );
  const { data: overdueData } = useFetch(
    () => billingService.getOverdueInvoices({ limit: 5 }),
    mockData.overdue
  );

  React.useEffect(() => {
    if (dashError) addAlert('error', 'Error loading dashboard', dashError.message);
  }, [dashError]);

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
  };
  const removeAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  /* ₹”€₹”€ KPI Card ₹”€₹”€ */
  const KpiCard = ({ label, value, change, icon, accent }) => {
    const isUp = change >= 0;
    return (
      <div className="kpi-card">
        <div className="kpi-card__top">
          <div className="kpi-card__icon" style={{ background: accent + '18', color: accent }}>
            {icon}
          </div>
          {change !== undefined && (
            <span className={`kpi-card__trend ${isUp ? 'kpi-card__trend--up' : 'kpi-card__trend--down'}`}>
              {isUp ? Icon.trendUp : Icon.trendDown}
              {Math.abs(change)}%
            </span>
          )}
        </div>
        <p className="kpi-card__value">{value}</p>
        <p className="kpi-card__label">{label}</p>
      </div>
    );
  };

  /* ₹”€₹”€ Line-style SVG Chart ₹”€₹”€ */
  const RevenueChart = () => {
    const data = [42, 58, 51, 67, 72, 61, 79, 84, 76, 88, 92, 85];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const w = 560; const h = 180; const pad = { t: 10, r: 10, b: 30, l: 40 };
    const iw = w - pad.l - pad.r;
    const ih = h - pad.t - pad.b;
    const max = Math.max(...data); const min = Math.min(...data) - 5;
    const xs = data.map((_, i) => pad.l + (i / (data.length - 1)) * iw);
    const ys = data.map(v => pad.t + ih - ((v - min) / (max - min)) * ih);
    const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
    const area = `${path} L${xs[xs.length-1]},${pad.t+ih} L${pad.l},${pad.t+ih} Z`;
    return (
      <div className="rev-chart">
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f8ef7" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#4f8ef7" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0,0.25,0.5,0.75,1].map((t, i) => (
            <line key={i} x1={pad.l} x2={pad.l+iw} y1={pad.t + t*ih} y2={pad.t + t*ih}
              stroke="#f1f5f9" strokeWidth="1"/>
          ))}
          {/* Area fill */}
          <path d={area} fill="url(#areaGrad)"/>
          {/* Line */}
          <path d={path} fill="none" stroke="#4f8ef7" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
          {/* Dots */}
          {xs.map((x, i) => (
            <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#4f8ef7" stroke="white" strokeWidth="1.5"/>
          ))}
          {/* X-axis labels */}
          {months.map((m, i) => (
            <text key={i} x={xs[i]} y={h-4} textAnchor="middle"
              fontSize="9" fill="#94a3b8">{m}</text>
          ))}
        </svg>
      </div>
    );
  };

  if (dashLoading || statsLoading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'360px' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
          <div className="dash-spinner"/>
          <p style={{ color:'#94a3b8', fontSize:'13px' }}>Loading dashboard...</p>
        </div>
        <style>{`
          .dash-spinner {
            width:32px; height:32px; border:3px solid #e2e8f0;
            border-top-color:#4f8ef7; border-radius:50%;
            animation: dashSpin 0.8s linear infinite;
          }
          @keyframes dashSpin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dash">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'20px' }}>
          {alerts.map(a => (
            <Alert key={a.id} type={a.type} title={a.title} message={a.message} onClose={() => removeAlert(a.id)}/>
          ))}
        </div>
      )}

      {/* ₹”€₹”€ Page header ₹”€₹”€ */}
      <div className="dash__topbar">
        <div>
          <h1 className="dash__title">{t('dashboard.overview')}</h1>
          <p className="dash__subtitle">
            {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </p>
        </div>
        <div className="dash__tabs">
          {['day','week','month','year'].map(r => (
            <button key={r} onClick={() => setTimeRange(r)}
              className={`dash__tab${timeRange === r ? ' dash__tab--active' : ''}`}
            >{r.charAt(0).toUpperCase() + r.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* ₹”€₹”€ KPI Cards ₹”€₹”€ */}
      <div className="dash__kpis">
        <KpiCard label={t('dashboard.revenue')}       value={`₹${(dashboardData?.totalRevenue   || 0).toLocaleString('en-IN')}`} change={dashboardData?.revenueTrend}  icon={Icon.revenue}   accent="#4f8ef7"/>
        <KpiCard label={t('dashboard.activeRentals')}  value={rentalStats?.active || 0}                                             change={rentalStats?.trend}           icon={Icon.rentals}   accent="#34c98a"/>
        <KpiCard label={t('dashboard.pendingBills')}   value={`₹${(dashboardData?.pendingPayments|| 0).toLocaleString('en-IN')}`}                                         icon={Icon.pending}   accent="#f5a623"/>
        <KpiCard label={t('dashboard.totalCustomers')} value={dashboardData?.totalCustomers || 0}                                   change={dashboardData?.customerTrend} icon={Icon.customers} accent="#9b6cf7"/>
      </div>

      {/* ₹”€₹”€ Charts row ₹”€₹”€ */}
      <div className="dash__charts">
        {/* Revenue trend */}
        <div className="dash-card dash-card--chart">
          <div className="dash-card__head">
            <div>
              <h3 className="dash-card__title">{t('dashboard.revenueChart')}</h3>
              <p className="dash-card__sub">Monthly performance this year</p>
            </div>
            <span className="dash-card__badge dash-card__badge--blue">This Year</span>
          </div>
          {revenueLoading
            ? <div style={{ height:'180px', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8', fontSize:'13px' }}>Loading...</div>
            : <RevenueChart/>}
        </div>

        {/* Performance indicators */}
        <div className="dash-card">
          <div className="dash-card__head">
            <div>
              <h3 className="dash-card__title">Performance Indicators</h3>
              <p className="dash-card__sub">Key operational metrics</p>
            </div>
          </div>
          <div className="perf-list">
            {[
              { label:'Avg. Daily Revenue',    value:`₹${(dashboardData?.avgDailyRevenue||0).toLocaleString('en-IN')}`, accent:'#4f8ef7', pct: 68 },
              { label:'Equipment Utilization', value:`${dashboardData?.equipmentUtilization||0}%`,                      accent:'#34c98a', pct: dashboardData?.equipmentUtilization||0 },
              { label:'Customer Satisfaction', value:`${dashboardData?.satisfaction||0}%`,                              accent:'#9b6cf7', pct: dashboardData?.satisfaction||0 },
              { label:'Monthly Recurring Rev', value:`₹${((dashboardData?.totalRevenue||0)*0.6).toLocaleString('en-IN')}`, accent:'#f5a623', pct: 60 },
            ].map((item, idx) => (
              <div key={idx} className="perf-row">
                <div className="perf-row__top">
                  <span className="perf-row__label">{item.label}</span>
                  <span className="perf-row__value">{item.value}</span>
                </div>
                <div className="perf-bar">
                  <div className="perf-bar__fill" style={{ width:`${item.pct}%`, background: item.accent }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ₹”€₹”€ Overdue Invoices ₹”€₹”€ */}
      {overdueData && overdueData.length > 0 && (
        <div className="dash-card dash-card--overdue">
          <div className="dash-card__head">
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ color:'#ef4444' }}>{Icon.warning}</span>
              <div>
                <h3 className="dash-card__title">{t('dashboard.overdueInvoices')}</h3>
                <p className="dash-card__sub">Requires immediate attention</p>
              </div>
            </div>
            <span className="dash-card__badge dash-card__badge--red">{overdueData.length} overdue</span>
          </div>

          <div className="overdue-table">
            <div className="overdue-table__head">
              <span>{t('dashboard.customer')}</span>
              <span>{t('dashboard.invoiceNo')}</span>
              <span>{t('common.amount')}</span>
              <span>{t('common.status')}</span>
            </div>
            {overdueData.slice(0, 5).map(inv => (
              <div key={inv.id} className="overdue-table__row">
                <span className="overdue-table__customer">{inv.customerName}</span>
                <span className="overdue-table__inv">{inv.invoiceNumber}</span>
                <span className="overdue-table__amount">₹{Number(inv.amount).toLocaleString('en-IN')}</span>
                <span className="overdue-badge">{t('common.overdue')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ₹”€₹”€ Styles ₹”€₹”€ */}
      <style>{`
        .dash { display: flex; flex-direction: column; gap: 20px; }

        /* Topbar */
        .dash__topbar {
          display: flex; justify-content: space-between; align-items: flex-start;
          flex-wrap: wrap; gap: 12px;
        }
        .dash__title {
          font-size: clamp(18px,3vw,24px); font-weight: 700;
          color: #0f172a; margin: 0 0 3px;
        }
        .dash__subtitle { font-size: 12.5px; color: #94a3b8; margin: 0; }

        .dash__tabs {
          display: flex; gap: 0;
          border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;
          background: white;
        }
        .dash__tab {
          padding: 7px 16px; border: none; background: transparent;
          color: #64748b; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.15s ease;
          border-right: 1px solid #e2e8f0;
        }
        .dash__tab:last-child { border-right: none; }
        .dash__tab:hover { background: #f8fafc; color: #334155; }
        .dash__tab--active {
          background: #4f8ef7; color: white !important;
          font-weight: 600;
        }

        /* KPI grid */
        .dash__kpis {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .kpi-card {
          background: white; border-radius: 10px;
          padding: 20px; border: 1px solid #e8ecf0;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .kpi-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }
        .kpi-card__top {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 16px;
        }
        .kpi-card__icon {
          width: 42px; height: 42px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .kpi-card__trend {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 11.5px; font-weight: 600; padding: 3px 7px;
          border-radius: 5px;
        }
        .kpi-card__trend--up   { background: #dcfce7; color: #16a34a; }
        .kpi-card__trend--down { background: #fee2e2; color: #dc2626; }
        .kpi-card__value {
          font-size: clamp(20px,2.5vw,26px); font-weight: 700;
          color: #0f172a; margin: 0 0 5px;
          letter-spacing: -0.5px;
        }
        .kpi-card__label {
          font-size: 12px; font-weight: 500; color: #94a3b8;
          margin: 0; text-transform: uppercase; letter-spacing: 0.4px;
        }

        /* Charts row */
        .dash__charts {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 16px;
        }

        /* Generic card */
        .dash-card {
          background: white; border-radius: 10px;
          border: 1px solid #e8ecf0; padding: 20px;
        }
        .dash-card--overdue { border-left: 3px solid #ef4444; }
        .dash-card__head {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 18px; gap: 8px;
        }
        .dash-card__title {
          font-size: 14.5px; font-weight: 600; color: #1e293b; margin: 0 0 3px;
        }
        .dash-card__sub { font-size: 12px; color: #94a3b8; margin: 0; }
        .dash-card__badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 5px; font-size: 11.5px; font-weight: 600;
          white-space: nowrap; flex-shrink: 0;
        }
        .dash-card__badge--blue { background: #eff6ff; color: #4f8ef7; }
        .dash-card__badge--red  { background: #fee2e2; color: #ef4444; }

        /* Revenue chart */
        .rev-chart { margin: 0 -4px; }

        /* Performance list */
        .perf-list { display: flex; flex-direction: column; gap: 16px; }
        .perf-row__top {
          display: flex; justify-content: space-between;
          align-items: baseline; margin-bottom: 7px;
        }
        .perf-row__label { font-size: 13px; color: #475569; font-weight: 500; }
        .perf-row__value { font-size: 13.5px; font-weight: 700; color: #0f172a; }
        .perf-bar {
          height: 5px; background: #f1f5f9; border-radius: 3px; overflow: hidden;
        }
        .perf-bar__fill {
          height: 100%; border-radius: 3px;
          transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
        }

        /* Overdue table */
        .overdue-table { display: flex; flex-direction: column; gap: 0; }
        .overdue-table__head {
          display: grid; grid-template-columns: 2fr 2fr 1.5fr 1fr;
          padding: 8px 12px; background: #f8fafc; border-radius: 6px;
          font-size: 11px; font-weight: 600; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .overdue-table__row {
          display: grid; grid-template-columns: 2fr 2fr 1.5fr 1fr;
          padding: 11px 12px; align-items: center;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease; cursor: pointer;
        }
        .overdue-table__row:last-child { border-bottom: none; }
        .overdue-table__row:hover { background: #fafafa; }
        .overdue-table__customer { font-size: 13.5px; font-weight: 600; color: #1e293b; }
        .overdue-table__inv { font-size: 13px; color: #64748b; font-family: monospace; }
        .overdue-table__amount { font-size: 13.5px; font-weight: 700; color: #0f172a; }
        .overdue-badge {
          display: inline-block; padding: 3px 8px;
          background: #fee2e2; color: #ef4444;
          border-radius: 4px; font-size: 11px; font-weight: 600;
        }

        /* ₹”€₹”€ RESPONSIVE ₹”€₹”€ */
        @media (max-width: 1200px) {
          .dash__kpis { grid-template-columns: repeat(2, 1fr); }
          .dash__charts { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .dash__tabs .dash__tab { padding: 6px 10px; font-size: 12px; }
          .kpi-card { padding: 15px; }
          .dash-card { padding: 15px; }
          .overdue-table__head,
          .overdue-table__row { grid-template-columns: 2fr 1.5fr 1fr; }
          .overdue-table__head span:nth-child(2),
          .overdue-table__row .overdue-table__inv { display: none; }
        }
        @media (max-width: 479px) {
          .dash__kpis { grid-template-columns: 1fr; }
          .overdue-table__head,
          .overdue-table__row { grid-template-columns: 1fr 1fr 80px; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

