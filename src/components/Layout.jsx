/**
 * Layout Component
 * Main application layout with sidebar navigation
 */

import React, { useState } from 'react';

const Layout = ({ children, currentPage = 'admin-dashboard', userRole = 'admin' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = {
    admin: [
      { id: 'admin-dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'customers', label: 'Customers', icon: '👥' },
      { id: 'rentals', label: 'Rentals', icon: '📦' },
      { id: 'inventory', label: 'Inventory', icon: '📚' },
      { id: 'billing', label: 'Billing', icon: '💳' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    customer: [
      { id: 'customer-portal', label: 'Dashboard', icon: '📊' },
      { id: 'my-rentals', label: 'My Rentals', icon: '📦' },
      { id: 'invoices', label: 'Invoices', icon: '💰' },
      { id: 'profile', label: 'Profile', icon: '👤' },
    ],
  };

  const navigation = menuItems[userRole] || menuItems.customer;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '256px' : '80px',
          backgroundColor: '#111827',
          color: 'white',
          transition: 'all 0.3s ease-in-out',
          overflowY: 'auto',
          minHeight: '100vh'
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid #374151' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {sidebarOpen && <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>APTER</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: '4px',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                borderRadius: '4px'
              }}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        <nav style={{ marginTop: '32px' }}>
          {navigation.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                transition: 'background-color 0.2s',
                backgroundColor: currentPage === item.id ? '#2563eb' : 'transparent',
                color: currentPage === item.id ? 'white' : '#d1d5db',
                textDecoration: 'none',
                cursor: 'pointer',
                borderLeft: currentPage === item.id ? '4px solid #60a5fa' : 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = currentPage !== item.id ? '#1f2937' : '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = currentPage === item.id ? '#2563eb' : 'transparent'}
              title={item.label}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {sidebarOpen && <span style={{ marginLeft: '16px', fontSize: '14px' }}>{item.label}</span>}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '100vh' }}>
        {/* Top Bar */}
        <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Annai Power Tools - ERP System
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ padding: '8px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
              🔔
            </button>
            <button style={{ padding: '8px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
              👤
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto" style={{ background: 'white' }}>
          <div className="p-8">
            {children ? children : <div>No content</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
