/**
 * BarcodeRentalPage — Simplified Counter Billing Form
 * Counter staff scans machine barcode → fills customer details → saves rental
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

/* ── ID proof options ───────────────────────────────────────── */
const ID_PROOF_TYPES = [
  'Aadhaar Card',
  'PAN Card',
  'Voter ID',
  'Driving Licence',
  'Passport',
  'Ration Card',
];

/* ── Initial form state ─────────────────────────────────────── */
const EMPTY_FORM = {
  // Machine (from barcode scan)
  machineId: '',
  serialNumber: '',
  purchaseDate: '',
  machineName: '',
  // Customer
  customerName: '',
  address: '',
  contactNumber: '',
  idProofType: '',
  idProofNumber: '',
  // Rental
  advanceAmount: '',
  rentFrom: '',
  rentTo: '',
};

/* ── Mock machine DB (replace with real API) ────────────────── */
const MACHINE_DB = {
  'MCH-001': { machineName: 'Bosch Hammer Drill',  serialNumber: 'BHD-2023-001', purchaseDate: '2023-03-15' },
  'MCH-002': { machineName: 'Makita Angle Grinder', serialNumber: 'MAG-2022-045', purchaseDate: '2022-08-20' },
  'MCH-003': { machineName: 'DeWalt Circular Saw',  serialNumber: 'DCS-2024-007', purchaseDate: '2024-01-10' },
  'MCH-004': { machineName: 'Hilti Rotary Hammer',  serialNumber: 'HRH-2023-019', purchaseDate: '2023-07-05' },
  'MCH-005': { machineName: 'Bosch Jigsaw',         serialNumber: 'BJW-2022-033', purchaseDate: '2022-11-28' },
};

/* ── Confirmation receipt component ────────────────────────── */
const ReceiptModal = ({ data, onClose, onPrint, t }) => {
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const calcDays = () => {
    if (!data.rentFrom || !data.rentTo) return 0;
    const diff = new Date(data.rentTo) - new Date(data.rentFrom);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };
  return (
    <div className="brp-overlay" onClick={onClose}>
      <div className="brp-receipt" onClick={e => e.stopPropagation()}>
        <div className="brp-receipt__header">
          <div className="brp-receipt__logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#4f8ef7"/>
              <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M11 18 L21 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div>
              <div className="brp-receipt__shop">Annai Power Tools</div>
              <div className="brp-receipt__tagline">{t('counter.receiptTitle')}</div>
            </div>
          </div>
          <button className="brp-receipt__close" onClick={onClose}>✕</button>
        </div>

        <div className="brp-receipt__body">
          <div className="brp-receipt__section-title">{t('counter.receiptMachine')}</div>
          <div className="brp-receipt__grid">
            <span className="brp-receipt__label">{t('counter.receiptMachineLabel')}</span>
            <span className="brp-receipt__value">{data.machineName || '—'}</span>
            <span className="brp-receipt__label">{t('counter.receiptMachineId')}</span>
            <span className="brp-receipt__value">{data.machineId || '—'}</span>
            <span className="brp-receipt__label">{t('counter.receiptSerial')}</span>
            <span className="brp-receipt__value">{data.serialNumber || '—'}</span>
            <span className="brp-receipt__label">{t('counter.receiptPurchase')}</span>
            <span className="brp-receipt__value">{formatDate(data.purchaseDate)}</span>
          </div>

          <div className="brp-receipt__divider" />

          <div className="brp-receipt__section-title">{t('counter.receiptCustomer')}</div>
          <div className="brp-receipt__grid">
            <span className="brp-receipt__label">{t('counter.receiptName')}</span>
            <span className="brp-receipt__value">{data.customerName}</span>
            <span className="brp-receipt__label">{t('counter.receiptAddress')}</span>
            <span className="brp-receipt__value">{data.address}</span>
            <span className="brp-receipt__label">{t('counter.receiptContact')}</span>
            <span className="brp-receipt__value">{data.contactNumber}</span>
            <span className="brp-receipt__label">{t('counter.receiptIdProof')}</span>
            <span className="brp-receipt__value">{data.idProofType} — {data.idProofNumber}</span>
          </div>

          <div className="brp-receipt__divider" />

          <div className="brp-receipt__section-title">{t('counter.receiptRental')}</div>
          <div className="brp-receipt__grid">
            <span className="brp-receipt__label">{t('counter.receiptAdvance')}</span>
            <span className="brp-receipt__value brp-receipt__value--accent">₹ {Number(data.advanceAmount || 0).toLocaleString('en-IN')}</span>
            <span className="brp-receipt__label">{t('counter.receiptFrom')}</span>
            <span className="brp-receipt__value">{formatDate(data.rentFrom)}</span>
            <span className="brp-receipt__label">{t('counter.receiptTo')}</span>
            <span className="brp-receipt__value">{formatDate(data.rentTo)}</span>
            <span className="brp-receipt__label">{t('counter.receiptDuration')}</span>
            <span className="brp-receipt__value">{calcDays()} {t('counter.days')}</span>
          </div>
        </div>

        <div className="brp-receipt__footer">
          <button className="brp-btn brp-btn--ghost" onClick={onClose}>{t('common.close')}</button>
          <button className="brp-btn brp-btn--primary" onClick={onPrint}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6}}>
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            {t('counter.printReceipt')}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const BarcodeRentalPage = () => {
  const { t } = useLanguage();
  const [form, setForm]             = useState(EMPTY_FORM);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanning, setScanning]     = useState(false);
  const [machineFound, setMachineFound] = useState(null); // null | 'found' | 'notfound'
  const [errors, setErrors]         = useState({});
  const [saved, setSaved]           = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [savedData, setSavedData]   = useState(null);
  const barcodeRef = useRef(null);

  /* Auto-focus barcode field on mount */
  useEffect(() => { barcodeRef.current?.focus(); }, []);

  /* ── Barcode lookup ─────────────────────────────────────── */
  const handleBarcodeScan = (raw) => {
    const id = raw.trim().toUpperCase();
    if (!id) return;
    setScanning(true);

    // Simulate async lookup (replace with real API call)
    setTimeout(() => {
      const machine = MACHINE_DB[id];
      if (machine) {
        setForm(prev => ({
          ...prev,
          machineId: id,
          machineName: machine.machineName,
          serialNumber: machine.serialNumber,
          purchaseDate: machine.purchaseDate,
        }));
        setMachineFound('found');
      } else {
        setForm(prev => ({ ...prev, machineId: id, machineName: '', serialNumber: '', purchaseDate: '' }));
        setMachineFound('notfound');
      }
      setScanning(false);
    }, 300);
  };

  const handleBarcodeKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBarcodeScan(barcodeInput);
    }
  };

  /* ── Form change ────────────────────────────────────────── */
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  /* ── Validation ─────────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!form.machineId)      e.machineId      = t('counter.errMachineId');
    if (!form.customerName.trim()) e.customerName = t('counter.errName');
    if (!form.address.trim())      e.address      = t('counter.errAddress');
    if (!/^\d{10}$/.test(form.contactNumber)) e.contactNumber = t('counter.errContact');
    if (!form.idProofType)         e.idProofType  = t('counter.errIdType');
    if (!form.idProofNumber.trim()) e.idProofNumber = t('counter.errIdNumber');
    if (!form.advanceAmount || isNaN(form.advanceAmount) || Number(form.advanceAmount) < 0)
      e.advanceAmount = t('counter.errAdvance');
    if (!form.rentFrom)  e.rentFrom  = t('counter.errRentFrom');
    if (!form.rentTo)    e.rentTo    = t('counter.errRentTo');
    if (form.rentFrom && form.rentTo && form.rentTo <= form.rentFrom)
      e.rentTo = t('counter.errRentToAfter');
    return e;
  };

  /* ── Save / Submit ──────────────────────────────────────── */
  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const record = {
      ...form,
      id: `RNT-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSavedData(record);
    setShowReceipt(true);
    setSaved(true);
  };

  /* ── Reset form ─────────────────────────────────────────── */
  const handleReset = () => {
    setForm(EMPTY_FORM);
    setBarcodeInput('');
    setMachineFound(null);
    setErrors({});
    setSaved(false);
    setSavedData(null);
    setShowReceipt(false);
    setTimeout(() => barcodeRef.current?.focus(), 50);
  };

  /* ── Print receipt ──────────────────────────────────────── */
  const handlePrint = () => window.print();

  /* ── Field helper ───────────────────────────────────────── */
  const Field = ({ label, required, error, children }) => (
    <div className="brp-field">
      <label className="brp-field__label">
        {label}{required && <span className="brp-field__req"> *</span>}
      </label>
      {children}
      {error && <div className="brp-field__error">{error}</div>}
    </div>
  );

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <>
      {/* ── Print styles (hidden on screen) ── */}
      <style>{`
        /* ─── Page layout ─── */
        .brp-page { padding: 28px 32px; max-width: 860px; margin: 0 auto; }
        .brp-page-title { font-size: 22px; font-weight: 700; color: #1a2035; margin:0 0 4px 0; }
        .brp-page-sub   { font-size: 13px; color: #7a8aa0; margin:0 0 28px 0; }

        /* ─── Barcode scanner strip ─── */
        .brp-scan-strip {
          display: flex; align-items: center; gap: 12px;
          background: #f0f6ff; border: 1.5px solid #bed3f9;
          border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;
        }
        .brp-scan-icon { color: #4f8ef7; flex-shrink: 0; }
        .brp-scan-input-wrap { flex: 1; }
        .brp-scan-label { font-size: 11px; font-weight: 600; color: #4f8ef7; text-transform: uppercase; letter-spacing:.5px; margin-bottom:4px; }
        .brp-scan-input {
          width: 100%; border: 1.5px solid #c5d6f5; border-radius: 8px;
          padding: 9px 14px; font-size: 15px; font-weight: 600; letter-spacing: 1px;
          color: #1a2035; background: #fff; outline: none; box-sizing: border-box;
          transition: border-color .15s;
        }
        .brp-scan-input:focus { border-color: #4f8ef7; }
        .brp-scan-btn {
          background: #4f8ef7; color: #fff; border: none; border-radius: 8px;
          padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer;
          transition: background .15s; white-space: nowrap;
        }
        .brp-scan-btn:hover { background: #3a7de5; }
        .brp-scan-status { font-size: 12px; margin-top: 6px; font-weight: 500; }
        .brp-scan-status--found    { color: #22a06b; }
        .brp-scan-status--notfound { color: #e5452f; }
        .brp-scan-status--scanning { color: #7a8aa0; }

        /* ─── Card sections ─── */
        .brp-card {
          background: #fff; border: 1.5px solid #e8edf5;
          border-radius: 12px; padding: 22px 24px; margin-bottom: 20px;
        }
        .brp-card__title {
          font-size: 13px; font-weight: 700; color: #4f8ef7;
          text-transform: uppercase; letter-spacing: .6px;
          margin: 0 0 18px 0; display: flex; align-items: center; gap: 8px;
        }
        .brp-card__title-line {
          flex: 1; height: 1px; background: #e8edf5;
        }

        /* ─── Machine readonly fields ─── */
        .brp-machine-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;
        }
        .brp-machine-item { }
        .brp-machine-item__label { font-size: 11px; color: #7a8aa0; margin-bottom: 3px; font-weight: 500; }
        .brp-machine-item__value {
          font-size: 14px; font-weight: 600; color: #1a2035;
          background: #f8faff; border: 1.5px solid #e8edf5;
          border-radius: 7px; padding: 8px 12px; min-height: 36px;
        }
        .brp-machine-item__value--empty { color: #c0cad8; font-weight: 400; font-style: italic; }

        /* ─── Form grid ─── */
        .brp-form-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }
        .brp-form-grid--3 {
          grid-template-columns: 1fr 1fr 1fr;
        }
        .brp-col-span-2 { grid-column: span 2; }

        /* ─── Fields ─── */
        .brp-field {}
        .brp-field__label { font-size: 12px; font-weight: 600; color: #4a5568; margin-bottom: 5px; display: block; }
        .brp-field__req   { color: #e53e3e; }
        .brp-field__error { font-size: 11px; color: #e53e3e; margin-top: 4px; }
        .brp-input, .brp-select, .brp-textarea {
          width: 100%; border: 1.5px solid #dde3ee; border-radius: 8px;
          padding: 9px 12px; font-size: 13.5px; color: #1a2035;
          background: #fff; outline: none; box-sizing: border-box;
          transition: border-color .15s, box-shadow .15s;
        }
        .brp-input:focus, .brp-select:focus, .brp-textarea:focus {
          border-color: #4f8ef7; box-shadow: 0 0 0 3px rgba(79,142,247,.12);
        }
        .brp-input--error, .brp-select--error { border-color: #e53e3e !important; }
        .brp-textarea { resize: vertical; min-height: 72px; }
        .brp-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237a8aa0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }

        /* ─── ID Proof row ─── */
        .brp-id-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        /* ─── Amount + date row ─── */
        .brp-bottom-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

        /* ─── Actions ─── */
        .brp-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        .brp-btn {
          border: none; border-radius: 8px; padding: 10px 22px;
          font-size: 14px; font-weight: 600; cursor: pointer; transition: .15s;
          display: inline-flex; align-items: center;
        }
        .brp-btn--primary  { background: #4f8ef7; color: #fff; }
        .brp-btn--primary:hover  { background: #3a7de5; }
        .brp-btn--ghost    { background: #f0f4fa; color: #4a5568; }
        .brp-btn--ghost:hover    { background: #e2e8f0; }
        .brp-btn--danger   { background: #fff0ee; color: #e53e3e; }
        .brp-btn--danger:hover   { background: #fde0da; }
        .brp-btn--success  { background: #22a06b; color: #fff; }
        .brp-btn--success:hover  { background: #1a8a59; }

        /* ─── Receipt modal ─── */
        .brp-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; backdrop-filter: blur(2px);
        }
        .brp-receipt {
          background: #fff; border-radius: 16px; width: 420px; max-width: 95vw;
          box-shadow: 0 20px 60px rgba(0,0,0,.2); overflow: hidden;
        }
        .brp-receipt__header {
          background: linear-gradient(135deg,#1a2035 0%,#2a3555 100%);
          padding: 18px 20px; display: flex; align-items: center; justify-content: space-between;
        }
        .brp-receipt__logo { display: flex; align-items: center; gap: 10px; }
        .brp-receipt__shop { color: #fff; font-weight: 700; font-size: 15px; }
        .brp-receipt__tagline { color: #8ea4c8; font-size: 11px; }
        .brp-receipt__close {
          background: rgba(255,255,255,.1); border: none; color: #fff;
          width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 13px;
        }
        .brp-receipt__body { padding: 20px; }
        .brp-receipt__section-title { font-size: 11px; font-weight: 700; color: #4f8ef7; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 10px; }
        .brp-receipt__grid { display: grid; grid-template-columns: 110px 1fr; gap: 6px 12px; margin-bottom: 4px; }
        .brp-receipt__label { font-size: 12px; color: #7a8aa0; }
        .brp-receipt__value { font-size: 12px; color: #1a2035; font-weight: 500; }
        .brp-receipt__value--accent { color: #22a06b; font-weight: 700; font-size: 14px; }
        .brp-receipt__divider { height: 1px; background: #e8edf5; margin: 14px 0; }
        .brp-receipt__footer { padding: 14px 20px; background: #f8faff; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e8edf5; }

        /* ─── Saved banner ─── */
        .brp-saved-banner {
          background: #e6f9f1; border: 1.5px solid #a3dfbf; border-radius: 10px;
          padding: 12px 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: #1a6b45; font-weight: 500;
        }

        /* ─── Print media ─── */
        @media print {
          .brp-overlay { position: static; background: none; backdrop-filter: none; }
          .brp-receipt { box-shadow: none; border-radius: 0; width: 100%; }
          .brp-receipt__footer, .brp-receipt__close { display: none !important; }
        }

        /* ─── Responsive ─── */
        @media (max-width: 640px) {
          .brp-page { padding: 16px; }
          .brp-form-grid, .brp-form-grid--3, .brp-id-row, .brp-bottom-row { grid-template-columns: 1fr; }
          .brp-col-span-2 { grid-column: span 1; }
          .brp-scan-strip { flex-wrap: wrap; }
          .brp-machine-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="brp-page">
        {/* ── Page heading ── */}
        <h1 className="brp-page-title">{t('counter.pageTitle')}</h1>
        <p className="brp-page-sub">{t('counter.pageSub')}</p>

        {/* ── Saved banner ── */}
        {saved && (
          <div className="brp-saved-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22a06b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {t('counter.savedSuccess')} — <strong>{savedData?.id}</strong>
            <button className="brp-btn brp-btn--ghost" style={{marginLeft:'auto', padding:'4px 14px', fontSize:'12px'}} onClick={() => setShowReceipt(true)}>{t('counter.viewReceipt')}</button>
            <button className="brp-btn brp-btn--primary" style={{padding:'4px 14px', fontSize:'12px'}} onClick={handleReset}>{t('counter.newEntry')}</button>
          </div>
        )}

        {/* ══ SECTION 1 — Barcode Scanner ═══════════════════════ */}
        <div className="brp-scan-strip">
          <span className="brp-scan-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9V5a2 2 0 0 1 2-2h4"/><path d="M3 15v4a2 2 0 0 0 2 2h4"/>
              <path d="M21 9V5a2 2 0 0 0-2-2h-4"/><path d="M21 15v4a2 2 0 0 1-2 2h-4"/>
              <line x1="7" y1="8" x2="7" y2="16"/><line x1="10" y1="8" x2="10" y2="16"/>
              <line x1="13" y1="8" x2="13" y2="16" strokeWidth="2.5"/><line x1="16" y1="8" x2="16" y2="16"/>
            </svg>
          </span>
          <div className="brp-scan-input-wrap">
            <div className="brp-scan-label">{t('counter.scanLabel')}</div>
            <div style={{display:'flex', gap:8}}>
              <input
                ref={barcodeRef}
                type="text"
                className={`brp-scan-input${errors.machineId ? ' brp-input--error' : ''}`}
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeKeyDown}
                placeholder={t('counter.scanPlaceholder')}
                disabled={saved}
              />
              <button className="brp-scan-btn" onClick={() => handleBarcodeScan(barcodeInput)} disabled={saved || scanning}>
                {scanning ? t('counter.looking') : t('counter.lookup')}
              </button>
            </div>
            {machineFound === 'found' && (
              <div className="brp-scan-status brp-scan-status--found">✓ {t('counter.machineFound')} — {form.machineName}</div>
            )}
            {machineFound === 'notfound' && (
              <div className="brp-scan-status brp-scan-status--notfound">✗ {t('counter.machineNotFound')}</div>
            )}
            {scanning && (
              <div className="brp-scan-status brp-scan-status--scanning">{t('counter.searching')}</div>
            )}
            {errors.machineId && <div className="brp-field__error">{errors.machineId}</div>}
          </div>
        </div>

        {/* ══ SECTION 2 — Machine Details ═══════════════════════ */}
        <div className="brp-card">
          <div className="brp-card__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            {t('counter.sectionMachine')}
            <div className="brp-card__title-line"/>
          </div>
          <div className="brp-machine-grid">
            {[
              { labelKey: 'counter.machineId',    field: 'machineId',    placeholder: 'MCH-XXX' },
              { labelKey: 'counter.machineName',  field: 'machineName',  placeholder: t('counter.autoFilled') },
              { labelKey: 'counter.serialNumber', field: 'serialNumber', placeholder: t('counter.autoFilled') },
              { labelKey: 'counter.purchaseDate', field: 'purchaseDate', placeholder: t('counter.autoFilled'), type: 'date' },
            ].map(({ labelKey, field, placeholder, type = 'text' }) => (
              <div key={field} className="brp-machine-item">
                <div className="brp-machine-item__label">{t(labelKey)}</div>
                <input
                  type={type}
                  className={`brp-input${!form[field] ? ' brp-machine-item__value--empty' : ''}`}
                  value={form[field]}
                  onChange={e => handleChange(field, e.target.value)}
                  placeholder={placeholder}
                  disabled={saved}
                  style={{background: machineFound === 'found' ? '#f0fff8' : undefined}}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ══ SECTION 3 — Customer Details ══════════════════════ */}
        <div className="brp-card">
          <div className="brp-card__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {t('counter.sectionCustomer')}
            <div className="brp-card__title-line"/>
          </div>

          <div className="brp-form-grid">
            {/* Name */}
            <Field label={t('counter.customerName')} required error={errors.customerName}>
              <input
                type="text"
                className={`brp-input${errors.customerName ? ' brp-input--error' : ''}`}
                value={form.customerName}
                onChange={e => handleChange('customerName', e.target.value)}
                placeholder={t('counter.fullNamePlaceholder')}
                disabled={saved}
              />
            </Field>

            {/* Contact */}
            <Field label={t('counter.contactNumber')} required error={errors.contactNumber}>
              <input
                type="tel"
                className={`brp-input${errors.contactNumber ? ' brp-input--error' : ''}`}
                value={form.contactNumber}
                onChange={e => handleChange('contactNumber', e.target.value.replace(/\D/g,'').slice(0,10))}
                placeholder={t('counter.contactPlaceholder')}
                disabled={saved}
              />
            </Field>

            {/* Address — spans full row */}
            <div className="brp-col-span-2">
              <Field label={t('counter.address')} required error={errors.address}>
                <textarea
                  className={`brp-textarea${errors.address ? ' brp-input--error' : ''}`}
                  value={form.address}
                  onChange={e => handleChange('address', e.target.value)}
                  placeholder={t('counter.addressPlaceholder')}
                  disabled={saved}
                />
              </Field>
            </div>

            {/* ID Proof Type */}
            <Field label={t('counter.idProofType')} required error={errors.idProofType}>
              <select
                className={`brp-select${errors.idProofType ? ' brp-select--error' : ''}`}
                value={form.idProofType}
                onChange={e => handleChange('idProofType', e.target.value)}
                disabled={saved}
              >
                <option value="">{t('counter.idProofTypePlaceholder')}</option>
                {ID_PROOF_TYPES.map(tp => <option key={tp} value={tp}>{tp}</option>)}
              </select>
            </Field>

            {/* ID Proof Number */}
            <Field label={t('counter.idProofNumber')} required error={errors.idProofNumber}>
              <input
                type="text"
                className={`brp-input${errors.idProofNumber ? ' brp-input--error' : ''}`}
                value={form.idProofNumber}
                onChange={e => handleChange('idProofNumber', e.target.value.toUpperCase())}
                placeholder={t('counter.idProofNumberPlaceholder')}
                disabled={saved}
              />
            </Field>
          </div>
        </div>

        {/* ══ SECTION 4 — Rental Details ════════════════════════ */}
        <div className="brp-card">
          <div className="brp-card__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {t('counter.sectionRental')}
            <div className="brp-card__title-line"/>
          </div>

          <div className="brp-bottom-row">
            {/* Advance Amount */}
            <Field label={t('counter.advanceAmount')} required error={errors.advanceAmount}>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'#7a8aa0',fontWeight:600,pointerEvents:'none'}}>₹</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  className={`brp-input${errors.advanceAmount ? ' brp-input--error' : ''}`}
                  style={{paddingLeft:26}}
                  value={form.advanceAmount}
                  onChange={e => handleChange('advanceAmount', e.target.value)}
                  placeholder="0"
                  disabled={saved}
                />
              </div>
            </Field>

            {/* Rent From */}
            <Field label={t('counter.rentFrom')} required error={errors.rentFrom}>
              <input
                type="date"
                className={`brp-input${errors.rentFrom ? ' brp-input--error' : ''}`}
                value={form.rentFrom}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => handleChange('rentFrom', e.target.value)}
                disabled={saved}
              />
            </Field>

            {/* Rent To */}
            <Field label={t('counter.rentTo')} required error={errors.rentTo}>
              <input
                type="date"
                className={`brp-input${errors.rentTo ? ' brp-input--error' : ''}`}
                value={form.rentTo}
                min={form.rentFrom || new Date().toISOString().split('T')[0]}
                onChange={e => handleChange('rentTo', e.target.value)}
                disabled={saved}
              />
            </Field>
          </div>

          {/* Duration preview */}
          {form.rentFrom && form.rentTo && form.rentTo > form.rentFrom && (
            <div style={{marginTop:12, padding:'10px 14px', background:'#f0f6ff', borderRadius:8, fontSize:13, color:'#4f8ef7', fontWeight:500}}>
              {t('counter.duration')}: {Math.ceil((new Date(form.rentTo) - new Date(form.rentFrom)) / (1000*60*60*24))} {t('counter.days')}
              &nbsp;·&nbsp;
              {t('counter.advance')}: ₹ {Number(form.advanceAmount || 0).toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {/* ══ Actions ══════════════════════════════════════════ */}
        {!saved && (
          <div className="brp-actions">
            <button className="brp-btn brp-btn--ghost" onClick={handleReset}>
              {t('counter.clearForm')}
            </button>
            <button className="brp-btn brp-btn--success" onClick={handleSave}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:7}}>
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              {t('counter.saveRental')}
            </button>
          </div>
        )}
      </div>

      {/* ── Receipt modal ── */}
      {showReceipt && savedData && (
        <ReceiptModal data={savedData} t={t} onClose={() => setShowReceipt(false)} onPrint={handlePrint} />
      )}
    </>
  );
};

export default BarcodeRentalPage;
