# 🗄️ Database Setup - Sonna Admin Dashboard

## 📁 Single Database Schema File
**File:** `backend-complete-schema.sql`

This is the **only database file** you need! It contains everything:
- ✅ All table creation (users, orders, promotions, admins)
- ✅ Row Level Security policies
- ✅ Indexes for performance
- ✅ Sample data for testing
- ✅ Triggers and functions

## 🚀 Quick Setup (2 minutes)

1. **Open Supabase Dashboard** → Your Project → SQL Editor
2. **Copy and paste** the entire content of `backend-complete-schema.sql`
3. **Click "Run"** 
4. **Done!** Your admin dashboard will now show real data

## 🎯 What This Creates

### Tables Created:
- `admins` - Admin user authentication
- `users` - Customer management 
- `orders` - Order tracking with real-time status
- `promotions` - Discount codes and offers
- `order_status_history` - Order status change tracking
- `cart_items` - Shopping cart functionality
- `user_promotions` - Promotion usage tracking

### Sample Data Included:
- 📧 **Admin Users:** `admin@sonnas.com`, `manager@sonnas.com`
- 👥 **Sample Customers:** 3 test customers with loyalty points
- 📦 **Sample Orders:** 3 orders with different statuses (pending, preparing, delivered)
- 🎫 **Sample Promotions:** WELCOME10, FLAT50, SWEET20

## 🔐 Admin Access
After running the SQL, you can login to the admin dashboard with:
- Email: `admin@sonnas.com` 
- The authentication system will automatically recognize this as an admin user

## ✅ Verification
After setup, your admin dashboard should display:
- **Order Management:** 3 sample orders
- **Customer Management:** 3 customers with analytics
- **Promotion Management:** 3 active promotions

---
*Need help? The schema is designed to be self-contained and error-free!*
