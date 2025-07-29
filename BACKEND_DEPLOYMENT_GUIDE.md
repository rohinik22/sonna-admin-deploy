# Backend Deployment Guide - Order Management System

## Overview
This guide helps you deploy the complete backend system for order management, user management, and promotions using your existing Supabase setup.

## 📋 What We've Created

### Database Schema
1. **`additional-backend-schema.sql`** - Extends your existing database with:
   - `users` table for customer management
   - `promotions` table for discount codes
   - `order_status_history` for tracking order changes
   - `user_promotions` for tracking promotion usage
   - Enhanced `orders` table with new columns

### Edge Functions
1. **`create-order`** - Handles complete order creation with promotion validation
2. **`update-order-status`** - Updates order status with real-time broadcasting
3. **`get-users`** - Admin endpoint to fetch and manage users
4. **`manage-promotions`** - Full CRUD operations for promotions

## 🚀 Deployment Steps

### Step 1: Update Database Schema
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/wbhfwagjmtyxipuntrut
2. Click "SQL Editor"
3. Create a new query
4. Copy and paste the entire content of `additional-backend-schema.sql`
5. Click "Run"

### Step 2: Deploy Edge Functions (Manual Method)

Since CLI isn't working, deploy through the dashboard:

#### Deploy create-order function:
1. Go to "Edge Functions" in Supabase dashboard
2. Click "Create function"
3. Name: `create-order`
4. Copy code from `supabase/functions/create-order/index.ts`
5. Paste and deploy

#### Deploy update-order-status function:
1. Create new function: `update-order-status`
2. Copy code from `supabase/functions/update-order-status/index.ts`
3. Paste and deploy

#### Deploy get-users function:
1. Create new function: `get-users`
2. Copy code from `supabase/functions/get-users/index.ts`
3. Paste and deploy

#### Deploy manage-promotions function:
1. Create new function: `manage-promotions`
2. Copy code from `supabase/functions/manage-promotions/index.ts`
3. Paste and deploy

## 🧪 Testing the APIs

### Test Create Order
```bash
curl -X POST https://wbhfwagjmtyxipuntrut.supabase.co/functions/v1/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "user_id": "USER_UUID",
    "customer_name": "Test Customer",
    "customer_phone": "+91-9876543210",
    "order_type": "delivery",
    "promotion_code": "WELCOME10",
    "items": [
      {
        "menu_item_id": "MENU_ITEM_UUID",
        "quantity": 2
      }
    ]
  }'
```

### Test Update Order Status
```bash
curl -X PUT https://wbhfwagjmtyxipuntrut.supabase.co/functions/v1/update-order-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "order_id": "ORDER_UUID",
    "new_status": "preparing",
    "notes": "Order is being prepared"
  }'
```

### Test Get Users (Admin only)
```bash
curl -X GET https://wbhfwagjmtyxipuntrut.supabase.co/functions/v1/get-users \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Test Manage Promotions
```bash
# Create promotion
curl -X POST https://wbhfwagjmtyxipuntrut.supabase.co/functions/v1/manage-promotions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "code": "NEWDEAL",
    "name": "New Deal",
    "discount_type": "percentage",
    "discount_value": 15,
    "minimum_order_amount": 300
  }'

# Get all promotions
curl -X GET https://wbhfwagjmtyxipuntrut.supabase.co/functions/v1/manage-promotions \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

## 🔐 Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Admin-only access for user management and promotions
- Users can only access their own data

### Real-time Updates
- Order status changes broadcast automatically
- Kitchen display and admin dashboard get instant updates

### Loyalty Points System
- Automatic calculation: 1 point per ₹10 spent
- Updates when order status changes to "delivered"

## 📊 Features Included

### Order Management
- ✅ Complete order creation with validation
- ✅ Promotion code validation and application
- ✅ Automatic tax and delivery fee calculation
- ✅ Real-time status updates
- ✅ Order history tracking

### User Management
- ✅ Customer profiles with loyalty points
- ✅ Order history and spending analytics
- ✅ Admin dashboard for user management

### Promotions System
- ✅ Percentage and fixed amount discounts
- ✅ Minimum order requirements
- ✅ Usage limits and tracking
- ✅ Expiry date validation

### Real-time Features
- ✅ Order status broadcasts
- ✅ Kitchen display updates
- ✅ Admin dashboard notifications

## 🎯 Next Steps

1. **Deploy the database schema first**
2. **Deploy all Edge Functions**
3. **Test each endpoint**
4. **Integrate with your admin dashboard**
5. **Enable real-time subscriptions in your frontend**

Your backend is now ready to handle the complete order lifecycle with real-time updates! 🚀
