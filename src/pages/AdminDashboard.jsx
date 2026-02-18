/**
 * Admin Dashboard Page - Modern Responsive UI
 * Overview of shop operations and key metrics with modern design
 * Responsiveness handled entirely via CSS classes / media queries - no JS isMobile state
 */

import React, { useState } from 'react';
import { useFetch } from '../hooks/useApi';
import analyticsService from '../services/analyticsService';
import rentalService from '../services/rentalService';
import billingService from '../services/billingService';
import { mockData } from '../utils/mockDataService';
import Alert from '../components/Alert';
import logger from '../utils/logger';

const AdminDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [timeRange, setTimeRange] = useState('month');

  // Fetch dashboard data with demo data fallback
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

  // Handle errors
  React.useEffect(() => {
    if (dashError) {
      addAlert('error', 'Error loading dashboard', dashError.message);
    }
  }, [dashError]);

  const addAlert = (type, title, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, title, message }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Modern Stat Card Component
  const ModernStatCard = ({ title, value, change, changeIcon, icon, color = 'blue', href = '#' }) => {
    const colorMap = {
      blue:   { lightBg: '#f0f4ff', textColor: '#667eea' },
      green:  { lightBg: '#fff0f4', textColor: '#f5576c' },
      purple: { lightBg: '#f0f8ff', textColor: '#00f2fe' },
      orange: { lightBg: '#fff8f0', textColor: '#fa709a' },
      red:    { lightBg: '#fff5f5', textColor: '#ff6b6b' },
    };

    const colors = colorMap[color];
    const isPositive = change >= 0;

    return (
      <div
        onClick={() => window.location.href = href}
        className="dash-stat-card"
        style={{ cursor: href !== '#' ? 'pointer' : 'default' }}
        onMouseEnter={e => {
          if (href !== '#') {
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={e => {
          if (href !== '#') {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <div className="dash-stat-card__top">
          <div className="dash-stat-card__icon" style={{ background: colors.lightBg }}>
            {icon}
          </div>
          {change !== undefined && (
            <div className="dash-stat-card__badge" style={{
              background: isPositive ? '#dcfce7' : '#fee2e2',
              color: isPositive ? '#15803d' : '#dc2626',
            }}>
              {changeIcon || (isPositive ? '↑' : '↓')}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        <p className="dash-stat-card__label">{title}</p>
        <p className="dash-stat-card__value">{value}</p>
      </div>
    );
  };

  // Chart Placeholder Component
  const ChartPlaceholder = ({ title, children }) => (
    <div className="dash-chart-card">
      <h3 className="dash-chart-card__title">{title}</h3>
      {children}
    </div>
  );

  // Simple Chart Visualization
  const SimpleChart = () => (
    <div className="dash-chart">
      {[65, 78, 82, 75, 88, 92, 85].map((value, idx) => (
        <div key={idx} className="dash-chart__col">
          <div
            className="dash-chart__bar"
            style={{ height: `${value}%` }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'scaleY(1.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scaleY(1)';
            }}
            title={`${value}%`}
          />
          <small className="dash-chart__label">W{idx + 1}</small>
        </div>
      ))}
    </div>
  );

  if (dashLoading || statsLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '400px', background: 'white', borderRadius: '12px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 2s linear infinite' }}>⏳</div>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading your dashboard...</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="dash">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="dash__alerts">
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
      )}

      {/* Page header */}
      <div className="dash__header">
        <div>
          <h1 className="dash__heading">Dashboard</h1>
          <p className="dash__subheading">Welcome back! Here's your business performance.</p>
        </div>

        {/* Time range selector */}
        <div className="dash__timerange">
          {['day', 'week', 'month', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`dash__range-btn${timeRange === range ? ' dash__range-btn--active' : ''}`}
              onMouseEnter={e => { if (timeRange !== range) e.currentTarget.style.background = '#f3f4f6'; }}
              onMouseLeave={e => { if (timeRange !== range) e.currentTarget.style.background = 'white'; }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI stat cards */}
      <div className="dash__kpi-grid">
        <ModernStatCard
          title="Total Revenue"
          value={`₹${(dashboardData?.totalRevenue || 0).toLocaleString()}`}
          change={dashboardData?.revenueTrend}
          icon="💰" color="blue"
        />
        <ModernStatCard
          title="Active Rentals"
          value={rentalStats?.active || 0}
          change={rentalStats?.trend}
          icon="📦" color="green"
        />
        <ModernStatCard
          title="Pending Payments"
          value={`₹${(dashboardData?.pendingPayments || 0).toLocaleString()}`}
          icon="⏳" color="orange"
        />
        <ModernStatCard
          title="Total Customers"
          value={dashboardData?.totalCustomers || 0}
          change={dashboardData?.customerTrend}
          icon="👥" color="purple"
        />
      </div>

      {/* Charts row */}
      <div className="dash__charts-grid">
        <ChartPlaceholder title="Revenue Trend (Weekly)">
          {revenueLoading
            ? <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading chart...</div>
            : <SimpleChart />}
        </ChartPlaceholder>

        <ChartPlaceholder title="Key Metrics">
          <div className="dash__metrics">
            {[
              { label: 'Avg. Daily Revenue',     value: `₹${(dashboardData?.avgDailyRevenue || 0).toLocaleString()}`, icon: '📊' },
              { label: 'Equipment Utilization',  value: `${dashboardData?.equipmentUtilization || 0}%`,              icon: '⚙️' },
              { label: 'Customer Satisfaction',  value: `${dashboardData?.satisfaction || 0}%`,                      icon: '⭐' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="dash__metric-row"
                style={{ borderBottom: idx < 2 ? '1px solid #e5e7eb' : 'none' }}
              >
                <div className="dash__metric-left">
                  <span className="dash__metric-icon">{stat.icon}</span>
                  <span className="dash__metric-label">{stat.label}</span>
                </div>
                <span className="dash__metric-value">{stat.value}</span>
              </div>
            ))}
          </div>
        </ChartPlaceholder>
      </div>

      {/* Overdue invoices */}
      {overdueData && overdueData.length > 0 && (
        <div className="dash__overdue">
          <div className="dash__overdue-header">
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <h2 className="dash__overdue-title">Overdue Invoices</h2>
            <span className="dash__overdue-count">{overdueData.length}</span>
          </div>

          <div className="dash__overdue-grid">
            {overdueData.slice(0, 5).map(invoice => (
              <div
                key={invoice.id}
                className="dash__overdue-card"
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(220,38,38,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>
                    {invoice.customerName}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{invoice.invoiceNumber}</p>
                </div>
                <div className="dash__overdue-card-footer">
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Amount</span>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626' }}>₹{invoice.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Component-scoped responsive styles */}
      <style>{`
        /* ── Dashboard shell ── */
        .dash { background: #f9fafb; min-height: 100%; }
        .dash__alerts { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }

        /* ── Page header ── */
        .dash__header {
          display: flex; justify-content: space-between; align-items: flex-start;
          flex-wrap: wrap; gap: 16px;
          padding-bottom: 20px; margin-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
          background: white;
        }
        .dash__heading  { font-size: clamp(22px, 4vw, 32px); font-weight: 700; color: #111827; margin: 0 0 6px; }
        .dash__subheading { color: #6b7280; margin: 0; font-size: 14px; }

        .dash__timerange { display: flex; gap: 8px; flex-wrap: wrap; }
        .dash__range-btn {
          padding: 7px 14px; border-radius: 8px; cursor: pointer;
          border: 1px solid #e5e7eb; background: white;
          color: #6b7280; font-weight: 500; font-size: 13px;
          text-transform: capitalize; white-space: nowrap;
          transition: all 0.2s ease;
        }
        .dash__range-btn--active {
          border: 2px solid #667eea; background: #f0f4ff;
          color: #667eea; font-weight: 600;
        }

        /* ── KPI grid ── */
        .dash__kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 24px;
        }

        /* ── Stat card ── */
        .dash-stat-card {
          background: white; border-radius: 12px; padding: 20px;
          border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        .dash-stat-card__top {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 14px;
        }
        .dash-stat-card__icon {
          width: 46px; height: 46px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .dash-stat-card__badge {
          display: flex; align-items: center; gap: 3px;
          padding: 4px 8px; border-radius: 6px;
          font-size: 11px; font-weight: 600;
        }
        .dash-stat-card__label {
          color: #6b7280; font-size: 12px; font-weight: 500;
          margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .dash-stat-card__value {
          font-size: clamp(20px, 3vw, 28px); font-weight: 700;
          color: #111827; margin: 0;
        }

        /* ── Charts grid ── */
        .dash__charts-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 24px; margin-bottom: 24px;
        }

        /* ── Chart card ── */
        .dash-chart-card {
          background: white; border-radius: 12px; padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .dash-chart-card__title {
          font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 18px;
        }

        /* ── Simple bar chart ── */
        .dash-chart {
          height: 260px; display: flex; align-items: flex-end;
          gap: 8px; justify-content: space-around; padding: 16px 0;
        }
        .dash-chart__col {
          display: flex; flex-direction: column; align-items: center; flex: 1;
          height: 100%;
          justify-content: flex-end;
        }
        .dash-chart__bar {
          width: 100%;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 6px 6px 0 0;
          transition: all 0.3s ease;
          cursor: pointer;
          min-height: 4px;
        }
        .dash-chart__label {
          color: #6b7280; margin-top: 8px; font-size: 11px;
        }

        /* ── Key metrics ── */
        .dash__metrics { display: flex; flex-direction: column; gap: 0; }
        .dash__metric-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 0;
        }
        .dash__metric-left { display: flex; align-items: center; gap: 12px; }
        .dash__metric-icon { font-size: 22px; }
        .dash__metric-label { color: #6b7280; font-size: 14px; font-weight: 500; }
        .dash__metric-value { font-size: 18px; font-weight: 700; color: #111827; }

        /* ── Overdue invoices ── */
        .dash__overdue {
          background: white; border-radius: 12px; padding: 24px;
          border: 1px solid #fecaca; border-left: 4px solid #dc2626;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 24px;
        }
        .dash__overdue-header {
          display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
        }
        .dash__overdue-title { font-size: 18px; font-weight: 600; color: #111827; margin: 0; }
        .dash__overdue-count {
          display: inline-block; padding: 3px 8px; border-radius: 6px;
          background: #fee2e2; color: #dc2626; font-size: 12px; font-weight: 600;
        }
        .dash__overdue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        .dash__overdue-card {
          padding: 16px; border-radius: 10px;
          background: #fef2f2; border: 1px solid #fecaca;
          cursor: pointer; transition: all 0.2s ease;
        }
        .dash__overdue-card-footer {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 12px; border-top: 1px solid #fecaca;
        }

        /* ── RESPONSIVE ───────────────────────────────────── */

        /* Large tablet → 2-col KPI */
        @media (max-width: 1200px) {
          .dash__kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .dash__charts-grid { grid-template-columns: 1fr; }
        }

        /* Small tablet → 2-col KPI kept, but chart goes slim */
        @media (max-width: 768px) {
          .dash__header { padding-bottom: 16px; margin-bottom: 16px; }
          .dash__range-btn { font-size: 12px; padding: 6px 10px; }
          .dash__kpi-grid { gap: 12px; }
          .dash-stat-card { padding: 16px; }
          .dash-chart { height: 180px; }
          .dash-chart__label { font-size: 10px; }
          .dash__overdue { padding: 16px; }
          .dash__metric-label { font-size: 13px; }
          .dash__metric-value { font-size: 16px; }
          .dash-chart-card { padding: 16px; }
          .dash-chart-card__title { font-size: 14px; }
        }

        /* Mobile phone → 1-col KPI */
        @media (max-width: 479px) {
          .dash__kpi-grid { grid-template-columns: 1fr; gap: 10px; }
          .dash__overdue-grid { grid-template-columns: 1fr; }
          .dash__timerange { gap: 6px; }
          .dash__range-btn { font-size: 11px; padding: 5px 8px; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
