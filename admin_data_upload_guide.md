# 🚀 Data Upload Guide for Render Deployment

Since shell access requires a paid plan, here are alternative ways to upload your data:

## Option 1: Django Admin Panel (Easiest)

### Step 1: Access Admin Panel
- Go to: https://african-004-backend.onrender.com/admin/
- Try these default credentials:
  - Username: `admin` / Password: `admin123`
  - Username: `aman` / Password: `aman@123`

### Step 2: Create Admin User (if needed)
If you can't log in, you'll need to create a superuser. Since shell access isn't available, you can:

1. **Temporarily modify your code** to create a superuser automatically
2. **Use the API endpoints** (if they're accessible)
3. **Contact Render support** to run a one-time command

### Step 3: Manual Data Entry
Once logged in, manually recreate your data:

#### Users
- Go to "Users" section
- Add each user:
  - **aman** (Admin): a.kasa@alustudent.com
  - **manager1** (Manager): manager1@example.com  
  - **staff1** (Staff): staff1@example.com

#### Inventory Items
- Go to "Inventory items" section
- Add each item:
  - Industrial Drill (SKU: DRL-1001, Qty: 50)
  - Safety Gloves (SKU: GLV-2002, Qty: 200)
  - Welding Helmet (SKU: HLT-3003, Qty: 75)
  - hammer (SKU: HMR-4004, Qty: 100)

#### Suppliers
- Go to "Suppliers" section
- Add each supplier with their contact details

#### Purchase Orders
- Go to "Purchase orders" section
- Recreate your orders

## Option 2: API Endpoints (If Accessible)

Try these endpoints directly:

```bash
# Test if endpoints are accessible
curl -X GET https://african-004-backend.onrender.com/api/users/
curl -X GET https://african-004-backend.onrender.com/api/inventory/
```

## Option 3: Upgrade to Paid Plan

Upgrade to Render's Starter plan ($7/month) to get:
- ✅ Shell access
- ✅ Zero downtime deployments
- ✅ Persistent disks
- ✅ One-off jobs
- ✅ Scaling capabilities

## Option 4: Database Migration Script

Create a script that runs during deployment:

```python
# In your Django app, create a management command
# that runs automatically on startup
```

## Quick Test Commands

Test your deployment:

```bash
# Test frontend
curl -I https://african-004-frontend.onrender.com

# Test backend
curl -I https://african-004-backend.onrender.com

# Test admin panel
curl -I https://african-004-backend.onrender.com/admin/
```

## Expected Data After Upload

- **Users**: 3 (aman, manager1, staff1)
- **Inventory Items**: 4 (Industrial Drill, Safety Gloves, Welding Helmet, hammer)
- **Suppliers**: 3 (ABC Industrial Supplies, etc.)
- **Purchase Orders**: 3 (various orders)

## Login Credentials

Once data is uploaded:
- **aman** / **aman@123** (Admin)
- **manager1** / **Testpass123** (Manager)
- **staff1** / **Testpass123** (Staff)

## Your Application URLs

- 🌐 **Frontend**: https://african-004-frontend.onrender.com
- 🔧 **Backend API**: https://african-004-backend.onrender.com
- 👨‍💼 **Admin Panel**: https://african-004-backend.onrender.com/admin/ 