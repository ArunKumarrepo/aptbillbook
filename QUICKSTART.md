# Annai Power Tools ERP - Quick Start Guide

## Installation & Setup

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- C# API running on IIS (see API Integration section)

### Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Endpoint**
   Create or update `.env` file:
   ```
   VITE_API_BASE_URL=http://your-api-server/api
   VITE_LOG_LEVEL=info
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173`

## Quick Navigation Guide

### Admin Links (Hash-based navigation)
- Dashboard: `#admin-dashboard`
- Customers: `#customers`
- Rentals: `#rentals`
- Inventory: `#inventory`
- Billing: `#billing`
- Analytics: `#analytics`

### Customer Portal
- Customer Dashboard: `#customer-portal`

## Common Workflows

### Creating a New Rental

1. Go to **Rentals** page
2. Click **New Rental** button
3. Select customer and equipment
4. Set start and end dates
5. Enter rental rate
6. Click **Create**

### Processing a Payment

1. Go to **Billing** page
2. Find the invoice in the table
3. Click **Pay** button
4. Enter payment amount and method
5. Click **Record Payment**

### Managing Inventory

1. Go to **Inventory** page
2. Click **Add Equipment** or **Edit** existing
3. Update information and stock levels
4. Click **Barcode** to print barcode labels

### Viewing Analytics

1. Go to **Analytics** page
2. Select time range (Week/Month/Quarter/Year)
3. View charts and metrics
4. Export reports (if enabled)

## API Integration Checklist

Ensure your C# API implements these endpoints:

### Customers
- [ ] GET /api/customers
- [ ] POST /api/customers
- [ ] PUT /api/customers/{id}
- [ ] DELETE /api/customers/{id}

### Rentals
- [ ] GET /api/rentals
- [ ] POST /api/rentals
- [ ] PATCH /api/rentals/{id}/return

### Billing
- [ ] GET /api/billing/invoices
- [ ] POST /api/billing/invoices
- [ ] POST /api/billing/payments

### Inventory
- [ ] GET /api/inventory
- [ ] POST /api/inventory
- [ ] PATCH /api/inventory/{id}/status

### Analytics
- [ ] GET /api/analytics/dashboard
- [ ] GET /api/analytics/revenue

See [DEVELOPMENT.md](./DEVELOPMENT.md) for complete API endpoint list.

## Troubleshooting

### "Failed to fetch" / API Connection Errors
- Verify API is running
- Check VITE_API_BASE_URL configuration
- Ensure CORS is enabled on API

### Page shows loading spinner indefinitely
- Check browser console for errors
- Verify API responses in Network tab
- Check API logs for 500 errors

### Form/Table not updating after action
- Click **refresh** button if available
- Check network tab for failed requests
- Verify data was saved in API

## Development

### Project Structure
```
src/
├── pages/          # Full page components
├── components/     # Reusable UI components
├── services/       # API service layer
├── hooks/          # Custom React hooks
└── utils/          # Helper functions
```

### Adding a New Feature

1. Create page in `src/pages/`
2. Create service in `src/services/` if API calls needed
3. Use reusable components from `src/components/`
4. Add to navigation in `src/components/Layout.jsx`
5. Update App.jsx routing

### Debugging

Enable debug logging:
```js
// In config.js
logging: {
  level: 'debug',
  logToConsole: true
}
```

## Performance Tips

- Use pagination for large datasets (set in config)
- Avoid loading all data at once
- Use refetch() only when needed
- Keep components focused and small

## Building for Production

```bash
npm run build
```

Optimized files in `dist/` folder ready for IIS deployment.

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checker |

## Technology Stack

- **React 19.2** - UI Framework
- **Vite 7.3** - Build tool & Dev server
- **Tailwind CSS 3.4** - Styling
- **JavaScript (ES6+)** - Language

## Key Files to Modify

| File | Purpose |
|------|---------|
| `src/utils/config.js` | App configuration |
| `src/components/Layout.jsx` | Navigation menu |
| `.env` | Environment variables |
| `package.json` | Dependencies |

## Support Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- Browser Console (F12) for errors

---

Generated: February 18, 2026
Version: 1.0.0
