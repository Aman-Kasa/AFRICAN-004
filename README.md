# Inventory and Procurement Management System

## Overview
A robust, scalable web application designed to empower African industries and SMEs with modern inventory, procurement, and supply chain management. Built with Django (backend) and React (frontend), it features real-time tracking, role-based access, analytics, notifications, and professional UI/UX.

## Features
- **User Authentication:** JWT, role-based (Admin, Manager, Staff)
- **Inventory Management:** CRUD, QR code scan, bulk import/export (CSV), low stock alerts
- **Purchase Orders:** Create, update, approve/reject, status tracking, CSV export
- **Supplier Management:** Add/view/edit/delete, search/filter, CSV export, analytics
- **Notifications:** In-app and email alerts for approvals, low stock, etc.
- **Reports & Analytics:** Downloadable CSVs, dashboard charts, supplier performance
- **User Management:** Admin add/edit/delete users, assign roles
- **Audit Logs:** View all system actions
- **Professional UI/UX:** Material-UI, responsive, accessible

## Tech Stack
- **Backend:** Python, Django, Django REST Framework, SimpleJWT
- **Frontend:** React, Material-UI, Recharts, html5-qrcode
- **Database:** SQLite (dev), PostgreSQL/MySQL (prod-ready)
- **Other:** CORS, CSV/PDF export, RESTful APIs

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

## LOG IN
   username = admin
   pass = admin123

### Backend Setup
```bash
cd backend/backend
python3 -m venv ../../venv
source ../../venv/bin/activate
pip install -r ../../requirements.txt
python3 manage.py migrate
python3 manage.py createsuperuser  # Follow prompts
python3 manage.py runserver
```

### Frontend Setup
```bash
cd ../../frontend
npm install
npm start
```

### Demo Data (Optional)
```bash
cd backend/backend
source ../../venv/bin/activate
python3 manage.py shell < demo_seed.py
```

## Usage
- Access the app at [http://localhost:3000](http://localhost:3000)
- Log in with your credentials
- Use the dashboard and navigation to manage inventory, orders, suppliers, users, and view reports/analytics
- Admins can access Django admin at [http://localhost:8000/admin/](http://localhost:8000/admin/)

## API Overview
- All endpoints are under `/api/`
- JWT authentication required for most endpoints
- Key endpoints:
  - `/api/inventory/items/` (CRUD, search/filter)
  - `/api/inventory/items/export/csv/` (CSV export)
  - `/api/orders/` (CRUD, search/filter)
  - `/api/orders/export/csv/` (CSV export)
  - `/api/orders/analytics/` (status distribution)
  - `/api/suppliers/` (CRUD, search/filter)
  - `/api/suppliers/export/csv/` (CSV export)
  - `/api/suppliers/analytics/` (top suppliers)
  - `/api/notifications/` (list, mark as read)
  - `/api/users/admin/` (user management)
  - `/api/audit-logs/` (view audit logs)

## Contribution Guidelines
- Fork the repo and create a feature branch
- Write clear, well-documented code with comments and docstrings
- Ensure all new features are tested
- Submit a pull request with a clear description

## License
MIT License

## Authors
- Aman Abraha Kasa (ALU)

---
For more details, see the SRS and in-code documentation. 
