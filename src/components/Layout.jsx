/**
 * Layout Component — Professional Enterprise UI
 * Clean dark-navy sidebar + white header, fully CSS-responsive
 * Breakpoints: mobile <640px | tablet 640–1024px | desktop ≥1024px
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

/* ── SVG icon set (inline, no external deps) ── */
const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  customers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  rentals: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  inventory: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  billing: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  analytics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  chevronLeft: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  chevronRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  barcode: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9V5a2 2 0 0 1 2-2h4"/><path d="M3 15v4a2 2 0 0 0 2 2h4"/>
      <path d="M21 9V5a2 2 0 0 0-2-2h-4"/><path d="M21 15v4a2 2 0 0 1-2 2h-4"/>
      <line x1="7" y1="8" x2="7" y2="16"/><line x1="10" y1="8" x2="10" y2="16"/>
      <line x1="13" y1="8" x2="13" y2="16"/><line x1="16" y1="8" x2="16" y2="16"/>
    </svg>
  ),
};

const Layout = ({ children, currentPage = 'admin-dashboard', userRole = 'admin' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const sidebarRef = useRef(null);
  const { t, language, changeLanguage } = useLanguage();

  // Determine if viewport is below the tablet/desktop breakpoint
  // Using a ref so we can read it in event handlers without stale closure issues
  const isMobileOrTabletRef = useRef(window.innerWidth < 1024);

  const menuItems = {
    admin: [
      { id: 'admin-dashboard', labelKey: 'nav.dashboard', icon: icons.dashboard,  accentColor: '#4f8ef7' },
      { id: 'customers',       labelKey: 'nav.customers', icon: icons.customers,  accentColor: '#34c98a' },
      { id: 'rentals',         labelKey: 'nav.rentals',   icon: icons.rentals,    accentColor: '#f5a623' },
      { id: 'inventory',       labelKey: 'nav.inventory', icon: icons.inventory,  accentColor: '#9b6cf7' },
      { id: 'billing',         labelKey: 'nav.billing',   icon: icons.billing,    accentColor: '#f76d6d' },
      { id: 'barcode-rental',  labelKey: 'nav.barcodeRental', icon: icons.barcode, accentColor: '#f5a623' },
      { id: 'analytics',       labelKey: 'nav.analytics', icon: icons.analytics,  accentColor: '#20c9d3' },
      { id: 'settings',        labelKey: 'nav.settings',  icon: icons.settings,   accentColor: '#8ea4c8' },
    ],
    customer: [
      { id: 'customer-portal', labelKey: 'nav.dashboard', icon: icons.dashboard,  accentColor: '#4f8ef7' },
      { id: 'my-rentals',      labelKey: 'nav.myRentals', icon: icons.rentals,    accentColor: '#f5a623' },
      { id: 'invoices',        labelKey: 'nav.invoices',  icon: icons.billing,    accentColor: '#f76d6d' },
      { id: 'profile',         labelKey: 'nav.customers', icon: icons.customers,  accentColor: '#34c98a' },
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
            <div className="apter-sidebar__logo">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#4f8ef7"/>
                <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M11 18 L21 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="apter-sidebar__title">APTER</h1>
              <p className="apter-sidebar__subtitle">Power Tools ERP</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="apter-sidebar__toggle"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? icons.chevronLeft : icons.chevronRight}
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="apter-nav" role="menubar" aria-label="Navigation menu">
          {navigation.map((item) => {
            const isActive  = currentPage === item.id;
            const isHovered = hoveredMenu === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={handleNavClick}
                onMouseEnter={() => setHoveredMenu(item.id)}
                onMouseLeave={() => setHoveredMenu(null)}
                className={`apter-nav__item${isActive ? ' apter-nav__item--active' : ''}${isHovered && !isActive ? ' apter-nav__item--hovered' : ''}`}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                title={!sidebarOpen ? t(item.labelKey) : ''}
              >
                <div
                  className="apter-nav__icon"
                  style={{ color: isActive ? item.accentColor : undefined }}
                >
                  {item.icon}
                </div>

                {sidebarOpen && (
                  <span className={`apter-nav__label${isActive ? ' apter-nav__label--active' : ''}`}>
                    {t(item.labelKey)}
                  </span>
                )}

                {isActive && sidebarOpen && (
                  <span className="apter-nav__dot" style={{ background: item.accentColor }} />
                )}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="apter-sidebar__footer">
          {sidebarOpen ? (
            <>
              <div className="apter-sidebar__footer-user">
                <div className="apter-sidebar__avatar">AD</div>
                <div>
                  <p className="apter-sidebar__footer-name">Admin</p>
                  <p className="apter-sidebar__footer-role">Administrator</p>
                </div>
              </div>
            </>
          ) : (
            <div className="apter-sidebar__avatar apter-sidebar__avatar--center">AD</div>
          )}
        </div>
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
              <span className="apter-search__icon">{icons.search}</span>
              <input
                type="text"
                placeholder={t('common.searchPlaceholder')}
                className="apter-search__input"
              />
            </div>

            {/* Language toggle */}
            <div className="apter-lang-toggle" role="group" aria-label="Language selector">
              <button
                className={`apter-lang-btn${language === 'en' ? ' apter-lang-btn--active' : ''}`}
                onClick={() => changeLanguage('en')}
                aria-pressed={language === 'en'}
                title="English"
              >
                EN
              </button>
              <button
                className={`apter-lang-btn${language === 'ta' ? ' apter-lang-btn--active' : ''}`}
                onClick={() => changeLanguage('ta')}
                aria-pressed={language === 'ta'}
                title="தமிழ்"
              >
                த
              </button>
            </div>

            {/* Divider */}
            <div className="apter-header__divider" />

            {/* Notifications */}
            <button className="apter-icon-btn" aria-label="Notifications" title="Notifications">
              {icons.bell}
              <span className="apter-badge">3</span>
            </button>

            {/* Profile */}
            <div className="apter-profile">
              <div className="apter-profile__avatar">AD</div>
              <div className="apter-profile__info">
                <span className="apter-profile__name">Admin</span>
                <span className="apter-profile__role">Administrator</span>
              </div>
            </div>
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
        /* ── System font stack ── */
        .apter-root, .apter-root * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, sans-serif;
          box-sizing: border-box;
        }

        /* ── Root shell ── */
        .apter-root {
          display: flex;
          min-height: 100vh;
          background: #f0f2f5;
          position: relative;
        }

        /* ── Overlay (mobile/tablet only) ── */
        .apter-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.45);
          z-index: 30;
          backdrop-filter: blur(3px);
        }

        /* ══════════════════════════════════════
           SIDEBAR  — dark navy, professional
           ══════════════════════════════════════ */
        .apter-sidebar {
          background: #0f172a;
          color: #cbd5e1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 100vh;
          transition: width 0.28s cubic-bezier(0.4,0,0.2,1),
                      transform 0.28s cubic-bezier(0.4,0,0.2,1);
          z-index: 40;
          flex-shrink: 0;
          border-right: 1px solid #1e293b;
        }
        .apter-sidebar--open   { width: 248px; transform: none; }
        .apter-sidebar--closed { width: 68px;  transform: none; }

        /* Sidebar header */
        .apter-sidebar__header {
          padding: 0 12px;
          height: 60px;
          border-bottom: 1px solid #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-shrink: 0;
        }
        .apter-sidebar__brand {
          display: flex; align-items: center; gap: 10px;
          flex: 1; overflow: hidden;
          transition: opacity 0.2s ease;
        }
        .apter-sidebar__brand--hidden { opacity: 0; width: 0; pointer-events: none; overflow: hidden; }
        .apter-sidebar__logo {
          width: 34px; height: 34px; min-width: 34px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .apter-sidebar__title {
          font-size: 14px; font-weight: 700; margin: 0;
          color: #f1f5f9; letter-spacing: 0.3px;
          white-space: nowrap;
        }
        .apter-sidebar__subtitle {
          font-size: 10px; margin: 1px 0 0 0;
          color: #64748b; white-space: nowrap;
        }
        .apter-sidebar__toggle {
          width: 30px; height: 30px; min-width: 30px;
          border-radius: 6px; border: 1px solid #1e293b;
          background: #1e293b; color: #64748b;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.18s ease; flex-shrink: 0;
        }
        .apter-sidebar__toggle:hover { background: #334155; color: #e2e8f0; }

        /* Nav section label */
        .apter-nav-section {
          padding: 20px 16px 6px;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.8px; text-transform: uppercase;
          color: #334155;
          white-space: nowrap; overflow: hidden;
        }

        /* Nav */
        .apter-nav {
          padding: 8px 10px;
          display: flex; flex-direction: column; gap: 2px;
          flex: 1;
        }
        .apter-nav__item {
          display: flex; align-items: center;
          padding: 9px 10px;
          border-radius: 7px;
          text-decoration: none;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.18s ease;
          gap: 11px;
          position: relative;
          white-space: nowrap;
        }
        .apter-nav__item--active {
          color: #f1f5f9;
          background: #1e293b;
        }
        .apter-nav__item--hovered:not(.apter-nav__item--active) {
          color: #cbd5e1;
          background: #1a2540;
        }
        .apter-nav__icon {
          width: 34px; height: 34px; min-width: 34px;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.18s ease;
          flex-shrink: 0;
        }
        .apter-nav__item--active .apter-nav__icon {
          background: #1e3a5f;
        }
        .apter-nav__label {
          font-size: 13.5px; font-weight: 500;
          overflow: hidden; text-overflow: ellipsis; flex: 1;
        }
        .apter-nav__label--active { font-weight: 600; color: #f1f5f9; }
        .apter-nav__dot {
          width: 6px; height: 6px; border-radius: 50%;
          flex-shrink: 0;
        }

        /* Sidebar footer */
        .apter-sidebar__footer {
          padding: 12px 10px;
          border-top: 1px solid #1e293b;
          flex-shrink: 0;
        }
        .apter-sidebar__footer-user {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 6px; border-radius: 7px;
        }
        .apter-sidebar__footer-user:hover { background: #1e293b; }
        .apter-sidebar__avatar {
          width: 32px; height: 32px; min-width: 32px;
          border-radius: 50%;
          background: #1e3a5f;
          color: #4f8ef7;
          font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .apter-sidebar__avatar--center { margin: 0 auto; }
        .apter-sidebar__footer-name {
          font-size: 13px; font-weight: 600; color: #e2e8f0; margin: 0;
        }
        .apter-sidebar__footer-role {
          font-size: 11px; color: #64748b; margin: 1px 0 0;
        }

        /* ══════════════════════════════════════
           MAIN AREA
           ══════════════════════════════════════ */
        .apter-main {
          flex: 1;
          display: flex; flex-direction: column;
          overflow: hidden;
          min-height: 100vh;
          min-width: 0;
        }

        /* ── Header ── */
        .apter-header {
          background: #ffffff;
          border-bottom: 1px solid #e8ecf0;
          height: 60px;
          padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
          position: sticky; top: 0; z-index: 20;
          flex-shrink: 0;
        }
        .apter-header__left {
          display: flex; align-items: center; gap: 12px;
          flex: 1; min-width: 0;
        }
        .apter-header__right {
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0;
        }
        .apter-header__title {
          font-size: 15px; font-weight: 600; margin: 0;
          color: #0f172a;
          white-space: nowrap;
        }
        .apter-header__title--short { display: none; }
        .apter-header__title--full  { display: inline; }
        .apter-header__divider {
          width: 1px; height: 24px; background: #e2e8f0;
          margin: 0 4px;
        }

        /* Hamburger */
        .apter-hamburger {
          display: none;
          width: 36px; height: 36px;
          border-radius: 7px; border: 1px solid #e2e8f0;
          background: white; color: #475569;
          align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.18s ease;
          flex-shrink: 0;
        }
        .apter-hamburger:hover { background: #f1f5f9; color: #0f172a; }

        /* Search */
        .apter-search {
          display: flex; align-items: center; gap: 8px;
          background: #f8fafc; border-radius: 7px;
          padding: 7px 12px; border: 1px solid #e2e8f0;
          min-width: 240px; transition: all 0.18s ease;
          color: #94a3b8;
        }
        .apter-search:focus-within {
          border-color: #4f8ef7;
          background: white;
          box-shadow: 0 0 0 3px rgba(79,142,247,0.1);
          color: #475569;
        }
        .apter-search__input {
          background: transparent; border: none; outline: none;
          font-size: 13.5px; width: 100%; color: #1e293b;
        }
        .apter-search__input::placeholder { color: #94a3b8; }
        .apter-search__icon { flex-shrink: 0; }

        /* Icon button */
        .apter-icon-btn {
          width: 36px; height: 36px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 7px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b;
          transition: all 0.18s ease; position: relative;
        }
        .apter-icon-btn:hover { background: #f1f5f9; color: #334155; border-color: #cbd5e1; }
        .apter-badge {
          position: absolute; top: -5px; right: -5px;
          background: #ef4444; color: white;
          font-size: 9px; width: 17px; height: 17px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; border: 2px solid white;
        }

        /* Profile */
        .apter-profile {
          display: flex; align-items: center; gap: 9px;
          padding: 5px 10px 5px 5px;
          border-radius: 8px; cursor: pointer;
          border: 1px solid #e2e8f0; background: #f8fafc;
          transition: all 0.18s ease;
        }
        .apter-profile:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .apter-profile__avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: #1e3a5f;
          color: #4f8ef7;
          font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .apter-profile__info { display: flex; flex-direction: column; }
        .apter-profile__name { font-size: 13px; font-weight: 600; color: #1e293b; line-height: 1.2; }
        .apter-profile__role { font-size: 11px; color: #94a3b8; }

        /* ── Language toggle ── */
        .apter-lang-toggle {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          padding: 2px;
          gap: 2px;
          flex-shrink: 0;
        }
        .apter-lang-btn {
          padding: 4px 10px;
          border-radius: 5px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          line-height: 1.4;
        }
        .apter-lang-btn:hover:not(.apter-lang-btn--active) {
          background: #e2e8f0;
          color: #334155;
        }
        .apter-lang-btn--active {
          background: #4f8ef7;
          color: #ffffff;
          box-shadow: 0 1px 4px rgba(79,142,247,0.25);
        }

        /* ── Content ── */
        .apter-content {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          background: #f0f2f5;
        }
        .apter-content__inner {
          padding: clamp(16px, 2.5vw, 28px);
          max-width: 1920px; margin: 0 auto;
          width: 100%;
        }

        /* ══════════════════════════════════════
           RESPONSIVE
           ══════════════════════════════════════ */
        @media (max-width: 1023px) {
          .apter-sidebar {
            position: fixed; top: 0; left: 0; height: 100%;
            width: 256px !important;
            box-shadow: 4px 0 24px rgba(0,0,0,0.25);
          }
          .apter-sidebar--open   { transform: translateX(0); }
          .apter-sidebar--closed { transform: translateX(-100%); }
          .apter-overlay--visible { display: block; }
          .apter-hamburger        { display: flex; }
          .apter-sidebar__toggle  { display: none; }
          .apter-sidebar__brand--hidden { opacity: 1; width: auto; pointer-events: auto; overflow: visible; }
        }
        @media (max-width: 767px) {
          .apter-search { display: none; }
          .apter-header { padding: 0 16px; }
          .apter-header__title--full  { display: none; }
          .apter-header__title--short { display: inline; }
          .apter-profile__info { display: none; }
          .apter-header__divider { display: none; }
        }
        @media (max-width: 479px) {
          .apter-content__inner { padding: 12px; }
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default Layout;
