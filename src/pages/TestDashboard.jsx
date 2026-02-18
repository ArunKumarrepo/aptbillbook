/**
 * Test Dashboard - Simplified version for debugging
 */

import React from 'react';

export default function TestDashboard() {
  return (
    <div style={{ padding: '20px', background: 'white' }}>
      <h1 style={{ color: '#333' }}>Test Dashboard - Backend Working! ✅</h1>
      <p style={{ color: '#666' }}>If you see this, the app is rendering correctly.</p>
      
      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: '#f0f0f0',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Test Data:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Dashboard Component Loaded</li>
          <li>React Hooks Working</li>
          <li>Styling Applied</li>
        </ul>
      </div>
    </div>
  );
}
