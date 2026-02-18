/**
 * Layout Component - Modern Fully Responsive Design
 * Main application layout with CSS-driven responsive sidebar and header
 * Breakpoints: mobile <640px | tablet 640–1024px | desktop >1024px
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

const Layout = ({ children, currentPage = 'admin-dashboard', userRole = 'admin' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const sidebarRef = useRef(null);

  // Determine if viewport is below the tablet/desktop breakpoint
  // Using a ref so we can read it in event handlers without stale closure issues
  const isMobileOrTabletRef = useRef(window.innerWidth < 1024);

  const menuItems = {
    admin: [
      { id: 'admin-dashboard', label: 'Dashboard', icon: '📊', color: '#667eea' },
      { id: 'customers', label: 'Customers', icon: '👥', color: '#f093fb' },
      { id: 'rentals', label: 'Rentals', icon: '📦', color: '#4facfe' },
      { id: 'inventory', label: 'Inventory', icon: '📚', color: '#43e97b' },
      { id: 'billing', label: 'Billing', icon: '💳', color: '#fa709a' },
      { id: 'analytics', label: 'Analytics', icon: '📈', color: '#ffa502' },
      { id: 'settings', label: 'Settings', icon: '⚙️', color: '#b37cea' },
    ],
    customer: [
      { id: 'customer-portal', label: 'Dashboard', icon: '📊', color: '#667eea' },
      { id: 'my-rentals', label: 'My Rentals', icon: '📦', color: '#4facfe' },
      { id: 'invoices', label: 'Invoices', icon: '💰', color: '#fa709a' },
      { id: 'profile', label: 'Profile', icon: '👤', color: '#43e97b' },
    ],
  };

  const navigation = menuItems[userRole] || menuItems.customer;

  // Sync sidebar open/closed state with viewport size changes
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      isMobileOrTabletRef.current = w < 1024;
      if (w < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on nav click when viewport is small
  const handleNavClick = useCallback(() => {
    if (isMobileOrTabletRef.current) {
      setSidebarOpen(false);
    }
  }, []);

  // Close sidebar with Escape key on small viewports
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen && isMobileOrTabletRef.current) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  return (
    <div className="apter-root">
      {/* Overlay — shown by CSS when sidebar is open on small screens */}
      <div
        className={`apter-overlay${sidebarOpen ? ' apter-overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        ref={sidebarRef}
        role="navigation"
        aria-label="Main navigation"
        className={`apter-sidebar${sidebarOpen ? ' apter-sidebar--open' : ' apter-sidebar--closed'}`}
      >
        {/* Logo / Toggle row */}
        <div className="apter-sidebar__header">
          <div className={`apter-sidebar__brand${sidebarOpen ? '' : ' apter-sidebar__brand--hidden'}`}>
            <div className="apter-sidebar__logo">A</div>
            <div>
              <h1 className="apter-sidebar__title">APTER</h1>
              <p className="apter-sidebar__subtitle">ERP System</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="apter-sidebar__toggle"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="apter-nav" role="menubar" aria-label="Navigation menu">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleNavClick}
              onMouseEnter={() => setHoveredMenu(item.id)}
              onMouseLeave={() => setHoveredMenu(null)}
              className={`apter-nav__item${currentPage === item.id ? ' apter-nav__item--active' : ''}${hoveredMenu === item.id ? ' apter-nav__item--hovered' : ''}`}
              role="menuitem"
              aria-current={currentPage === item.id ? 'page' : undefined}
              title={!sidebarOpen ? item.label : ''}
            >
              {currentPage === item.id && <div className="apter-nav__bar" />}

              <div
                className="apter-nav__icon"
                style={{
                  background: hoveredMenu === item.id || currentPage === item.id
                    ? `${item.color}20` : 'transparent',
                }}
              >
                {item.icon}
              </div>

              {sidebarOpen && (
                <span className={`apter-nav__label${currentPage === item.id ? ' apter-nav__label--active' : ''}`}>
                  {item.label}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="apter-sidebar__footer">
            <p>v1.0.0</p>
            <p>© 2026 APTER</p>
          </div>
        )}
      </aside>

      {/* ── Main area ───────────────────────────────────────── */}
      <main className="apter-main">
        {/* Header / Navbar */}
        <header role="banner" className="apter-header">
          {/* Left */}
          <div className="apter-header__left">
            {/* Hamburger — visible below 1024px via CSS */}
            <button
              className="apter-hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              ☰
            </button>

            {/* App name */}
            <div>
              <h2 className="apter-header__title">
                <span className="apter-header__title--full">Annai Power Tools</span>
                <span className="apter-header__title--short">APTER</span>
              </h2>
            </div>
          </div>

          {/* Right */}
          <div className="apter-header__right">
            {/* Search — hidden below 768px via CSS */}
            <div className="apter-search">
              <input
                type="text"
                placeholder="Search..."
                className="apter-search__input"
                onFocus={e => {
                  e.currentTarget.parentElement.style.borderColor = '#667eea';
                  e.currentTarget.parentElement.style.background = 'white';
                }}
                onBlur={e => {
                  e.currentTarget.parentElement.style.borderColor = '#e5e7eb';
                  e.currentTarget.parentElement.style.background = '#f3f4f6';
                }}
              />
              <span className="apter-search__icon">🔍</span>
            </div>

            {/* Notifications */}
            <button
              className="apter-icon-btn"
              aria-label="Notifications"
              title="Notifications"
            >
              🔔
              <span className="apter-badge">3</span>
            </button>

            {/* Profile */}
            <button
              className="apter-profile-btn"
              aria-label="User profile"
              title="Profile"
            >
              👤
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="apter-content">
          <div className="apter-content__inner">
            {children || <div style={{ color: '#9ca3af', fontSize: '14px' }}>No content</div>}
          </div>
        </div>
      </main>

      {/* ── Styles ──────────────────────────────────────────── */}
      <style>{`
        /* ── Reset / base ── */
        *, *::before, *::after { box-sizing: border-box; }

        /* ── Root shell ── */
        .apter-root {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
          position: relative;
        }

        /* ── Overlay (mobile/tablet only) ── */
        .apter-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 30;
          backdrop-filter: blur(2px);
        }

        /* ── Sidebar ── */
        .apter-sidebar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 100vh;
          transition: width 0.35s cubic-bezier(0.4,0,0.2,1),
                      transform 0.35s cubic-bezier(0.4,0,0.2,1);
          z-index: 40;
          flex-shrink: 0;
        }

        /* Desktop — sidebar is always in flow */
        .apter-sidebar--open  { width: 260px; transform: none; }
        .apter-sidebar--closed { width: 76px;  transform: none; }

        /* ── Sidebar header ── */
        .apter-sidebar__header {
          padding: 20px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          min-height: 72px;
        }

        .apter-sidebar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          overflow: hidden;
          transition: opacity 0.2s ease, width 0.2s ease;
        }
        .apter-sidebar__brand--hidden { opacity: 0; width: 0; pointer-events: none; }

        .apter-sidebar__logo {
          width: 38px; height: 38px; min-width: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 700;
        }
        .apter-sidebar__title { font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.5px; }
        .apter-sidebar__subtitle { font-size: 11px; margin: 2px 0 0 0; opacity: 0.8; }

        .apter-sidebar__toggle {
          padding: 8px;
          cursor: pointer;
          background: rgba(255,255,255,0.15);
          border: none;
          color: white;
          font-size: 16px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          min-width: 38px; min-height: 38px;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }
        .apter-sidebar__toggle:hover { background: rgba(255,255,255,0.28); }

        /* ── Nav ── */
        .apter-nav {
          padding: 16px 8px;
          display: flex; flex-direction: column; gap: 4px;
          flex: 1;
        }
        .apter-nav__item {
          display: flex; align-items: center;
          padding: 11px 10px;
          border-radius: 12px;
          text-decoration: none;
          color: rgba(255,255,255,0.72);
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
        .apter-nav__item--active { color: #fff; background: rgba(255,255,255,0.2); }
        .apter-nav__item--hovered:not(.apter-nav__item--active) { background: rgba(255,255,255,0.1); }
        .apter-nav__bar {
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 4px; background: rgba(255,255,255,0.45);
          border-radius: 0 12px 12px 0;
        }
        .apter-nav__icon {
          width: 38px; height: 38px; min-width: 38px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 19px;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }
        .apter-nav__label {
          font-size: 14px; font-weight: 500;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          flex: 1; opacity: 0.85;
        }
        .apter-nav__label--active { font-weight: 600; opacity: 1; }

        /* ── Sidebar footer ── */
        .apter-sidebar__footer {
          padding: 14px;
          margin-top: auto;
          border-top: 1px solid rgba(255,255,255,0.1);
          font-size: 12px; opacity: 0.65; text-align: center;
        }
        .apter-sidebar__footer p { margin: 0 0 4px; }

        /* ── Main area ── */
        .apter-main {
          flex: 1;
          display: flex; flex-direction: column;
          overflow: hidden;
          min-height: 100vh;
          min-width: 0;
        }

        /* ── Header ── */
        .apter-header {
          background: rgba(255,255,255,0.97);
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          padding: 14px 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
          position: sticky; top: 0; z-index: 20;
        }
        .apter-header__left {
          display: flex; align-items: center; gap: 14px;
          flex: 1; min-width: 0;
        }
        .apter-header__right {
          display: flex; align-items: center; gap: 12px;
          flex-shrink: 0;
        }
        .apter-header__title {
          font-size: 18px; font-weight: 700; margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
        }
        .apter-header__title--short { display: none; }
        .apter-header__title--full  { display: inline; }

        /* Hamburger — hidden on desktop, shown below 1024px via media query */
        .apter-hamburger {
          display: none;
          padding: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none; color: white; font-size: 18px;
          border-radius: 8px; cursor: pointer;
          align-items: center; justify-content: center;
          min-width: 40px; min-height: 40px;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .apter-hamburger:hover { transform: scale(1.05); }

        /* ── Search ── */
        .apter-search {
          display: flex; align-items: center;
          background: #f3f4f6; border-radius: 10px;
          padding: 8px 14px; border: 1px solid #e5e7eb;
          min-width: 220px; transition: all 0.2s ease;
        }
        .apter-search__input {
          background: transparent; border: none; outline: none;
          font-size: 14px; width: 100%; color: #111827;
        }
        .apter-search__icon { color: #9ca3af; font-size: 15px; margin-left: 8px; }

        /* ── Icon button (notifications) ── */
        .apter-icon-btn {
          padding: 8px; background: #f3f4f6;
          border: 1px solid #e5e7eb; border-radius: 10px;
          cursor: pointer; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          min-width: 40px; min-height: 40px;
          transition: all 0.2s ease; position: relative;
        }
        .apter-icon-btn:hover { background: #e5e7eb; transform: scale(1.05); }
        .apter-badge {
          position: absolute; top: -4px; right: -4px;
          background: #ef4444; color: white;
          font-size: 10px; width: 18px; height: 18px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700;
        }

        /* ── Profile button ── */
        .apter-profile-btn {
          padding: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none; border-radius: 10px; cursor: pointer;
          font-size: 18px; color: white;
          display: flex; align-items: center; justify-content: center;
          min-width: 40px; min-height: 40px;
          transition: transform 0.2s ease;
        }
        .apter-profile-btn:hover { transform: scale(1.05); }

        /* ── Content ── */
        .apter-content {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          background: #f8f9fa;
        }
        .apter-content__inner {
          padding: clamp(16px, 3vw, 32px);
          max-width: 1920px; margin: 0 auto;
          width: 100%;
        }

        /* ──────────────────────────────────────────────────────
           RESPONSIVE BREAKPOINTS
           ────────────────────────────────────────────────────── */

        /* Tablet & Mobile: sidebar overlays content */
        @media (max-width: 1023px) {
          .apter-sidebar {
            position: fixed;
            top: 0; left: 0;
            height: 100%;
            width: 268px !important;
            box-shadow: 8px 0 32px rgba(102,126,234,0.25);
          }
          .apter-sidebar--open  { transform: translateX(0); }
          .apter-sidebar--closed { transform: translateX(-100%); }

          .apter-overlay--visible { display: block; }
          .apter-hamburger        { display: flex; }

          /* Desktop toggle inside sidebar is less useful on mobile — hide it */
          .apter-sidebar__toggle  { display: none; }

          /* Always show the brand text because sidebar is full-width when open */
          .apter-sidebar__brand--hidden {
            opacity: 1; width: auto; pointer-events: auto;
          }
        }

        /* Small tablets */
        @media (max-width: 767px) {
          .apter-search { display: none; }
          .apter-header { padding: 12px 16px; }
          .apter-header__title--full  { display: none; }
          .apter-header__title--short { display: inline; }
        }

        /* Mobile phones */
        @media (max-width: 479px) {
          .apter-content__inner { padding: 12px; }
          .apter-header { gap: 10px; }
        }

        /* ── Animations ── */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default Layout;
