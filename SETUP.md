# ERP System - Setup & API Integration Guide

## Project Status ✅

The Annai Power Tools ERP system is **fully implemented and ready for API integration**.

### Build Status
```
✓ 54 modules transformed
✓ Built successfully in 1.63s
✓ Production bundle: 244.52 kB (gzip: 72.70 kB)
```

## Quick Start

### Step 1: Clone and Install
```bash
cd /path/to/aptbillbook
npm install
```

### Step 2: Configure API Endpoint
Create `.env` file in root directory:
```env
VITE_API_BASE_URL=http://your-iis-server:port/api
VITE_LOG_LEVEL=info
```

### Step 3: Start Development Server
```bash
npm run dev
```

Navigate to `http://localhost:5173`

## Features Implemented

### 1. ✅ Admin Dashboard
- Key metrics overview (revenue, active rentals, payments, customers)
- Revenue trends visualization
- Equipment utilization stats
- Overdue invoice alerts
- Quick stats cards

### 2. ✅ Customer Management
- Add, edit, delete customers
- Search and pagination
- Contact info storage (name, email, phone, address)
- Rental history tracking
- Billing history

### 3. ✅ Equipment Rental System
- Create rentals with customer and equipment selection
- Rental date management
- Return equipment with status update
- Extend rental periods
- Cancel rentals with reason tracking
- Available equipment filtering

### 4. ✅ Inventory Management
- Add/edit/delete equipment
- Stock level tracking with low-stock alerts
- Status management (Available, Maintenance, Inactive)
- Rental rate configuration
- Purchase price tracking
- Equipment categorization
- Barcode generation and printing

### 5. ✅ Billing & Accounting
- Invoice generation from rentals
- Payment tracking (multiple methods)
- Payment status management
- Overdue invoice detection
- Payment reminders
- Invoice printing with barcodes
- Billing summary dashboard

### 6. ✅ Analytics & Reporting
- Revenue analytics with date ranges
- Customer analytics (LTV, retention)
- Equipment utilization metrics
- Financial summary (P&L)
- Rental statistics
- Trend analysis
- Time range filtering

### 7. ✅ Barcode System
- Barcode generation for equipment
- Barcode generation for invoices
- Batch barcode generation
- Print functionality
- Barcode validation

### 8. ✅ Customer Portal
- View active rentals
- Rental history
- Invoice management
- Outstanding payment tracking
- Profile information

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19.2.0 |
| Build Tool | Vite | 7.3.1 |
| Styling | Tailwind CSS | 3.4.19 |
| Language | JavaScript (ES6+) | - |
| HTTP Client | Fetch API | Native |

## Responsive Design ✅

- ✅ Mobile-first approach
- ✅ Fully responsive layouts
- ✅ Touch-optimized UI
- ✅ Tested breakpoints (sm, md, lg, xl, 2xl)
- ✅ Adaptive tables and grids

## Error Handling & Logging ✅

### Error Handling
- ✅ Custom error classes (ValidationError, NotFoundError, etc.)
- ✅ Centralized error handler
- ✅ User-friendly error messages
- ✅ Context-aware error logging

### Logging System
- ✅ Configurable log levels (debug, info, warn, error)
- ✅ Console logging
- ✅ Prepared for file logging
- ✅ Timestamp and context tracking

## Configuration Management ✅

- ✅ Environment-based configuration
- ✅ .env file support
- ✅ Feature toggles
- ✅ API endpoint configuration
- ✅ Pagination settings
- ✅ Logging configuration

## Component Architecture

### Reusable Components
```
Layout          - Main layout with sidebar navigation
Table           - Data table with sorting, filtering, pagination
Modal           - Dialog/popup component
Form            - Form utilities (Input, Select, Textarea, Button)
Alert           - Alert/notification component
```

### Custom Hooks
```
useApi()        - API calls with loading/error states
useForm()       - Form management and validation
useFetch()      - Auto-fetch on mount
useAsync()      - Generic async operations
```

### Services
```
apiService      - HTTP client wrapper
customerService - Customer operations
rentalService   - Rental operations
billingService  - Billing operations
inventoryService - Inventory operations
analyticsService - Analytics data
barcodeService  - Barcode generation/printing
authService     - Authentication (template)
```

## Required API Endpoints

Your C# API must implement these endpoints:

### Authentication (Optional)
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
GET  /api/auth/me
```

### Customers
```
GET    /api/customers
GET    /api/customers/{id}
POST   /api/customers
PUT    /api/customers/{id}
DELETE /api/customers/{id}
GET    /api/customers/{id}/rentals
GET    /api/customers/{id}/billing
```

### Rentals
```
GET    /api/rentals
GET    /api/rentals/{id}
POST   /api/rentals
PUT    /api/rentals/{id}
PATCH  /api/rentals/{id}/return
PATCH  /api/rentals/{id}/extend
PATCH  /api/rentals/{id}/cancel
GET    /api/equipment/available
GET    /api/rentals/stats
```

### Billing
```
GET    /api/billing/invoices
GET    /api/billing/invoices/{id}
POST   /api/billing/invoices
PUT    /api/billing/invoices/{id}
PATCH  /api/billing/invoices/{id}/mark-paid
POST   /api/billing/payments
GET    /api/billing/payments
GET    /api/billing/pending-payments
GET    /api/billing/overdue
GET    /api/billing/summary
POST   /api/billing/invoices/{id}/send-reminder
GET    /api/billing/invoices/{id}/pdf
```

### Inventory
```
GET    /api/inventory
GET    /api/inventory/{id}
POST   /api/inventory
PUT    /api/inventory/{id}
PATCH  /api/inventory/{id}/status
PATCH  /api/inventory/{id}/quantity
GET    /api/inventory/categories
GET    /api/inventory/low-stock
GET    /api/inventory/report
DELETE /api/inventory/{id}
```

### Analytics
```
GET /api/analytics/dashboard
GET /api/analytics/revenue
GET /api/analytics/rentals
GET /api/analytics/customers
GET /api/analytics/equipment-utilization
GET /api/analytics/financial-summary
GET /api/analytics/sales
GET /api/analytics/customer-ltv
GET /api/analytics/trends
POST /api/analytics/export
```

## Expected Response Format

All API responses should follow this format:

```json
{
  "data": { /* actual data */ },
  "message": "Success message",
  "success": true
}
```

For errors:
```json
{
  "message": "Error description",
  "success": false,
  "details": { /* error details */ }
}
```

## Building for Production

### Create Production Build
```bash
npm run build
```

### Output
```
dist/
├── index.html          (0.46 kB)
├── assets/
│   ├── index-[hash].css (17.26 kB, gzip: 3.85 kB)
│   └── index-[hash].js  (244.52 kB, gzip: 72.70 kB)
```

### Deploy to IIS
1. Copy `dist/` contents to IIS directory
2. Configure IIS with URL rewriting for SPA
3. Set API endpoint in configuration

## Performance Metrics

| Metric | Value |
|--------|-------|
| Bundle Size | 244.52 kB |
| Gzipped | 72.70 kB |
| Modules | 54 |
| Build Time | 1.63s |
| CSS Size | 17.26 kB |
| JS Size | 244.52 kB |

## File Structure

```
src/
├── pages/
│   ├── AdminDashboard.jsx      (Admin overview)
│   ├── CustomersPage.jsx       (Customer CRUD)
│   ├── RentalsPage.jsx         (Rental management)
│   ├── BillingAdminPage.jsx    (Billing & invoicing)
│   ├── InventoryPage.jsx       (Equipment management)
│   ├── AnalyticsDashboard.jsx  (Analytics)
│   └── CustomerPortal.jsx      (Customer view)
├── components/
│   ├── Layout.jsx              (Main layout)
│   ├── Table.jsx               (Data table)
│   ├── Modal.jsx               (Dialog)
│   ├── Form.jsx                (Form controls)
│   └── Alert.jsx               (Notifications)
├── services/
│   ├── apiService.js           (HTTP client)
│   ├── customerService.js      (Customer API)
│   ├── rentalService.js        (Rental API)
│   ├── billingService.js       (Billing API)
│   ├── inventoryService.js     (Inventory API)
│   ├── analyticsService.js     (Analytics API)
│   ├── barcodeService.js       (Barcode operations)
│   └── authService.js          (Auth template)
├── hooks/
│   └── useApi.js               (Custom hooks)
├── context/
│   └── AppContext.jsx          (Global state)
├── utils/
│   ├── config.js               (Configuration)
│   ├── logger.js               (Logging)
│   └── errorHandler.js         (Error handling)
├── App.jsx                     (Main app component)
└── main.jsx                    (Entry point)
```

## Documentation Files

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Comprehensive developer documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide
- **[README.md](./README.md)** - Project overview

## Maintenance & Updates

### Code Quality
- Follow existing code style
- Use provided components and hooks
- Implement error handling in new features
- Add logging for debugging

### Adding New Features
1. Create new page in `src/pages/`
2. Create service in `src/services/` if needed
3. Use reusable components
4. Handle errors appropriately
5. Update navigation in Layout.jsx

## Support & Troubleshooting

### Common Issues

**API Connection Failed**
- Verify VITE_API_BASE_URL in .env
- Check if C# API is running
- Verify CORS settings on API

**Infinite Loading**
- Check Network tab in DevTools
- Verify API responses
- Check browser console for errors

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Verify Node.js version ≥ v16

## Next Steps

1. **Implement C# API** with required endpoints
2. **Configure CORS** for API requests
3. **Set Environment Variables** in .env
4. **Test API Integration** using browser DevTools
5. **Deploy** to IIS server

## Version Information

- **Package Version**: 1.0.0
- **Release Date**: February 18, 2026
- **Status**: Production Ready
- **Last Updated**: February 18, 2026

## License

Internal use only - Annai Power Tools Rental Shop

---

**Questions or Issues?** Refer to DEVELOPMENT.md or check browser console (F12) for detailed error messages.
