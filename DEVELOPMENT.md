# Annai Power Tools ERP System - Developer Documentation

## Overview

This is a comprehensive Enterprise Resource Planning (ERP) system built with React and Vite for Annai Power Tools Rental Shop. It provides complete management of customers, equipment rentals, billing, inventory, and provides analytics and accounting features.

## Project Structure

```
src/
├── pages/                 # Page components
│   ├── AdminDashboard.jsx        # Admin overview dashboard
│   ├── CustomersPage.jsx         # Customer management
│   ├── RentalsPage.jsx           # Rental management
│   ├── BillingAdminPage.jsx      # Billing & invoicing
│   ├── InventoryPage.jsx         # Inventory management
│   ├── AnalyticsDashboard.jsx    # Analytics & reporting
│   └── CustomerPortal.jsx        # Customer-facing portal
├── components/            # Reusable components
│   ├── Layout.jsx        # Main layout with sidebar
│   ├── Table.jsx         # Data table with pagination
│   ├── Modal.jsx         # Dialog component
│   ├── Form.jsx          # Form components (Input, Select, etc.)
│   └── Alert.jsx         # Alert/notification component
├── services/             # API service layer
│   ├── apiService.js           # HTTP client wrapper
│   ├── customerService.js      # Customer API calls
│   ├── rentalService.js        # Rental API calls
│   ├── billingService.js       # Billing API calls
│   ├── inventoryService.js     # Inventory API calls
│   ├── analyticsService.js     # Analytics API calls
│   └── barcodeService.js       # Barcode generation & printing
├── hooks/                # Custom React hooks
│   └── useApi.js         # useApi, useForm, useFetch hooks
├── utils/                # Utility functions
│   ├── config.js         # Application configuration
│   ├── logger.js         # Logging system
│   └── errorHandler.js   # Error handling
└── styles/               # Global styles (if needed)
```

## Key Features

### 1. Admin Dashboard
- Overview of key business metrics
- Revenue trends and projections
- Active rental count and status
- Pending payments tracking
- Quick access to overdue invoices

### 2. Customer Management
- Add, edit, and delete customers
- Search and filter capabilities
- Store customer contact information and address
- Track customer rental history
- View customer billing information

### 3. Equipment Rental System
- Create new rentals for customers
- Track active rentals
- Return equipment with automatic status updates
- Extend rental periods
- Cancel rentals with reason tracking

### 4. Inventory Management
- Add and manage equipment
- Track equipment status (Available, Maintenance, Inactive)
- Monitor stock levels with low-stock alerts
- Generate and print barcodes for equipment
- Set rental rates and purchase prices
- Equipment categorization

### 5. Billing & Accounting
- Generate invoices from completed rentals
- Track payment status
- Record multiple payment methods (Cash, Check, Bank Transfer, Credit Card, UPI)
- Send payment reminders
- View overdue invoices
- Print invoices with barcodes

### 6. Analytics & Reporting
- Revenue analytics and trends
- Customer analytics (lifetime value, retention rate)
- Equipment utilization metrics
- Financial summary (profit, expenses, margins)
- Rental statistics
- Custom date range filtering

### 7. Barcode System
- Generate barcodes for equipment and invoices
- Print barcodes using browser print functionality
- Barcode scanning support (for future integration)
- Batch barcode generation

### 8. Customer Portal
- Customers can view their active rentals
- Access rental history
- View and download invoices
- Track outstanding payments
- Update profile information

## Configuration

The application is configured via `src/utils/config.js`:

```javascript
{
  api: {
    baseURL: 'http://localhost:5000/api',  // C# API endpoint
    timeout: 30000
  },
  logging: {
    enabled: true,
    level: 'info',  // 'debug', 'info', 'warn', 'error'
    logToConsole: true,
    logToFile: false
  },
  features: {
    barcodePrinting: true,
    analytics: true,
    accounting: true,
    customerManagement: true,
    inventoryManagement: true
  }
}
```

To change the API endpoint, update the `VITE_API_BASE_URL` environment variable:

```bash
# .env file
VITE_API_BASE_URL=http://your-api-server/api
VITE_LOG_LEVEL=info
```

## API Integration

This frontend connects to C# REST APIs hosted on IIS. All API calls are made through the centralized `apiService`.

### Service Layer Pattern

Each domain has its own service file that abstracts API calls:

```javascript
// Example: Customer Service
const customerService = {
  getCustomers: async (params) => apiService.get('/customers', { params }),
  createCustomer: async (data) => apiService.post('/customers', data),
  updateCustomer: async (id, data) => apiService.put(`/customers/${id}`, data),
  deleteCustomer: async (id) => apiService.delete(`/customers/${id}`)
};
```

### Expected API Endpoints

The following endpoints are expected from your C# API:

#### Customers
- `GET /api/customers` - List customers
- `GET /api/customers/{id}` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer
- `GET /api/customers/{id}/rentals` - Get customer rentals
- `GET /api/customers/{id}/billing` - Get customer billing

#### Rentals
- `GET /api/rentals` - List rentals
- `GET /api/rentals/{id}` - Get single rental
- `POST /api/rentals` - Create rental
- `PUT /api/rentals/{id}` - Update rental
- `PATCH /api/rentals/{id}/return` - Return equipment
- `PATCH /api/rentals/{id}/extend` - Extend rental
- `PATCH /api/rentals/{id}/cancel` - Cancel rental
- `GET /api/equipment/available` - Get available equipment

#### Billing
- `GET /api/billing/invoices` - List invoices
- `GET /api/billing/invoices/{id}` - Get invoice
- `POST /api/billing/invoices` - Create invoice
- `PUT /api/billing/invoices/{id}` - Update invoice
- `PATCH /api/billing/invoices/{id}/mark-paid` - Mark as paid
- `POST /api/billing/payments` - Record payment
- `GET /api/billing/payments` - Payment history
- `GET /api/billing/pending-payments` - Pending payments
- `GET /api/billing/overdue` - Overdue invoices
- `GET /api/billing/summary` - Billing summary

#### Inventory
- `GET /api/inventory` - List equipment
- `GET /api/inventory/{id}` - Get equipment
- `POST /api/inventory` - Add equipment
- `PUT /api/inventory/{id}` - Update equipment
- `PATCH /api/inventory/{id}/status` - Update status
- `GET /api/inventory/categories` - Get categories
- `GET /api/inventory/low-stock` - Low stock items

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard overview
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/rentals` - Rental analytics
- `GET /api/analytics/customers` - Customer analytics
- `GET /api/analytics/equipment-utilization` - Equipment utilization
- `GET /api/analytics/financial-summary` - Financial summary
- `GET /api/analytics/trends` - Trends data

## Error Handling

The application includes comprehensive error handling:

```javascript
import errorHandler from './utils/errorHandler';

try {
  const result = await someApiCall();
} catch (error) {
  const handledError = errorHandler.handleError(error);
  // handledError includes: message, statusCode, details, timestamp
}
```

### Custom Error Classes

- `AppError` - Base application error
- `ValidationError` - Form validation errors
- `NotFoundError` - 404 errors
- `UnauthorizedError` - 401 errors
- `ForbiddenError` - 403 errors
- `ConflictError` - 409 errors
- `ServerError` - 500 errors

## Logging

The logger is configured in `src/utils/logger.js`:

```javascript
import logger from './utils/logger';

logger.debug('Debug message', { data });
logger.info('Info message', { data });
logger.warn('Warning message', { data });
logger.error('Error message', { error });
```

Log levels can be configured via `config.logging.level`:
- `debug` - Most verbose
- `info` - General information
- `warn` - Warnings
- `error` - Errors only

## Custom Hooks

### useApi Hook
Handles API calls with loading and error states:

```javascript
const { data, loading, error, execute } = useApi(apiFunction, dependencies);
```

### useForm Hook
Manages form state and validation:

```javascript
const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit
} = useForm(initialValues, onSubmit);
```

### useFetch Hook
Auto-fetches data on component mount:

```javascript
const { data, loading, error, refetch } = useFetch(apiFunction);
```

## Responsive Design

The application is fully responsive and built with Tailwind CSS:

- **Mobile**: Single column layouts, full-width tables
- **Tablet**: Two-column grids
- **Desktop**: Three to four-column grids
- **Large screens**: Four+ column layouts

Responsive breakpoints:
- `sm: 640px`
- `md: 768px`
- `lg: 1024px`
- `xl: 1280px`
- `2xl: 1536px`

## Running the Application

### Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5173`

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_LOG_LEVEL=info
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Performance Optimization

- Code splitting for pages
- Component lazy loading
- API request caching
- Pagination for large datasets
- Optimized re-renders with React hooks

## Security Considerations

1. **API Authentication**: Implement JWT tokens or session-based auth
   ```javascript
   apiService.setAuthToken(token);
   ```

2. **CORS**: Configure CORS on your C# API
3. **HTTPS**: Use HTTPS in production
4. **Input Validation**: All forms validate on both client and server
5. **Error Messages**: Don't expose sensitive information in error messages

## Future Enhancements

- [ ] Authentication and authorization system
- [ ] Real-time notifications via WebSockets
- [ ] Advanced charting library (Chart.js, Recharts)
- [ ] Barcode scanning mobile app
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] PDF reports generation
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Backup and data export

## Troubleshooting

### API Connection Issues

If you see "Failed to fetch" errors:
1. Check if the API server is running
2. Verify the `VITE_API_BASE_URL` is correct
3. Check CORS settings on the API

### Performance Issues

1. Check the Network tab in DevTools
2. Enable debug logging: `VITE_LOG_LEVEL=debug`
3. Profile React components using React DevTools

### Build Errors

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check Node.js version: `node --version` (v16+)

## Support

For issues or questions about the React frontend, refer to:
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

## License

Internal use only - Annai Power Tools Rental Shop

---

**Last Updated**: February 18, 2026
**Version**: 1.0.0
