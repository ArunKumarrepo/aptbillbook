# Demo Mode - Quick Guide

## ✅ Application is Now Running!

Your ERP system is loading with **demo data**. This allows you to explore all features without needing the API backend.

**Access it at**: http://localhost:5175

---

## 📊 Demo Data Included

The application includes realistic sample data:

### Customers (5)
- Ramesh Kumar, Priya Singh, Amit Patel, Neha Sharma, Rajesh Kumar

### Equipment (4)
- Power Drill, Concrete Mixer, Impact Driver, Angle Grinder

### Rentals (3)
- Active and completed rentals with dates and amounts

### Invoices (3)
- Paid, pending, and overdue invoices

### Analytics
- Revenue trends, customer metrics, equipment utilization

---

## 🔄 Switch to Real API

When your C# API is ready:

### Step 1: Stop Demo Mode
Edit `.env`:
```env
VITE_DEMO_MODE=false
VITE_API_BASE_URL=http://your-api-server/api
```

### Step 2: Implement API Endpoints
Create endpoints matching the documentation in [SETUP.md](./SETUP.md)

### Step 3: Restart App
```bash
npm run dev
```

---

## 🎯 What to Test in Demo Mode

✅ **Navigate** between all pages using the sidebar  
✅ **View** dashboard metrics and analytics  
✅ **Search** in tables using the search box  
✅ **Sort** table columns by clicking headers  
✅ **Paginate** through large datasets  
✅ **Open** forms and modals  
✅ **See** responsive design on different screen sizes  

---

## ⚠️ What Won't Work in Demo Mode

❌ Saving changes (forms will show validation but won't persist)  
❌ Creating new records  
❌ Deleting records  
❌ Real API calls  
❌ Email notifications  
❌ Barcode printing  

These will work once you implement the API.

---

## 🔌 API Integration Checklist

When switching to real API:

- [ ] Create C# API with required endpoints
- [ ] Enable CORS on API
- [ ] Set `VITE_DEMO_MODE=false` in .env
- [ ] Set `VITE_API_BASE_URL` to your API server
- [ ] Test API responses in browser Network tab (F12)
- [ ] Handle authentication if needed
- [ ] Test all CRUD operations

---

## 📞 Still Not Loading?

If the page shows blank or errors:

1. **Check browser console** (F12 → Console tab)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Hard reload** (Ctrl+Shift+R)
4. **Check dev server output** for error messages

---

## 🚀 Next Steps

1. **Explore** the demo application
2. **Review** the codebase
3. **Start** implementing C# API
4. **Test** API integration when ready

---

**Happy exploring!** Your ERP system is ready to go! 🎉

See [START_HERE.md](./START_HERE.md) for more information.
