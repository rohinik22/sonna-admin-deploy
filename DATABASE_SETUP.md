# 🗄️ Database Schema Setup - Sonna Admin Dashboard

## 🚨 **Current Issue**
Your admin dashboard is showing empty data because the required database tables don't exist in Supabase yet. The Edge Functions and services are trying to query non-existent tables.

## 🛠️ **Quick Fix: Create Database Tables**

Run these SQL commands in your **Supabase SQL Editor** to create all required tables:

### Step 1: Create Core Tables

```sql
-- ============================================================================
-- SONNA ADMIN DASHBOARD - DATABASE SCHEMA
-- ============================================================================

-- 1. USERS TABLE (Customer Management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    address JSONB,
    loyalty_points INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. ADMINS TABLE (Admin Authentication)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. ORDERS TABLE (Order Management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    order_type TEXT NOT NULL DEFAULT 'delivery', -- 'delivery', 'pickup', 'dine-in'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'preparing', 'ready', 'delivered', 'cancelled'
    items JSONB NOT NULL, -- Array of order items
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    promotion_code TEXT,
    delivery_address JSONB,
    notes TEXT,
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- 4. PROMOTIONS TABLE (Promotion Management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL, -- 'percentage' or 'fixed_amount'
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
    maximum_discount_amount DECIMAL(10,2),
    usage_limit INTEGER DEFAULT 0, -- 0 = unlimited
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ORDER_STATUS_HISTORY TABLE (Order Timeline)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    notes TEXT,
    changed_by TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

-- Promotions indexes
CREATE INDEX IF NOT EXISTS idx_promotions_code ON public.promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_valid_dates ON public.promotions(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON public.promotions(is_active);

-- Admins indexes
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Users policies
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.email() = email);

CREATE POLICY "Service role full access users" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- Admins policies  
CREATE POLICY "Admins can read own data" ON public.admins
    FOR SELECT USING (auth.email() = email);

CREATE POLICY "Service role full access admins" ON public.admins
    FOR ALL USING (auth.role() = 'service_role');

-- Orders policies
CREATE POLICY "Service role full access orders" ON public.orders
    FOR ALL USING (auth.role() = 'service_role');

-- Promotions policies
CREATE POLICY "Service role full access promotions" ON public.promotions
    FOR ALL USING (auth.role() = 'service_role');

-- Order status history policies
CREATE POLICY "Service role full access order_status_history" ON public.order_status_history
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON public.promotions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 2: Create Admin User

```sql
-- Create your admin user (replace with your actual email)
INSERT INTO public.admins (full_name, email, role)
VALUES ('Admin User', 'admin@sonnas.com', 'admin')
ON CONFLICT (email) DO NOTHING;
```

### Step 3: Create Sample Data (Optional for Testing)

```sql
-- Sample users
INSERT INTO public.users (email, full_name, phone, loyalty_points, total_orders, total_spent) VALUES
('customer1@test.com', 'John Doe', '+91-9876543210', 150, 3, 450.00),
('customer2@test.com', 'Jane Smith', '+91-9876543211', 89, 2, 289.00),
('customer3@test.com', 'Mike Johnson', '+91-9876543212', 234, 5, 780.00)
ON CONFLICT (email) DO NOTHING;

-- Sample promotions
INSERT INTO public.promotions (code, name, description, discount_type, discount_value, minimum_order_amount, valid_from, valid_until, created_by) VALUES
('WELCOME10', 'Welcome Discount', 'First time customer discount', 'percentage', 10.00, 100.00, NOW(), NOW() + INTERVAL '30 days', 'admin@sonnas.com'),
('SAVE50', 'Flat 50 Off', 'Flat discount on orders above 300', 'fixed_amount', 50.00, 300.00, NOW(), NOW() + INTERVAL '15 days', 'admin@sonnas.com'),
('LOYALTY20', 'Loyalty Bonus', 'Special discount for loyal customers', 'percentage', 20.00, 200.00, NOW(), NOW() + INTERVAL '60 days', 'admin@sonnas.com')
ON CONFLICT (code) DO NOTHING;

-- Sample orders
INSERT INTO public.orders (order_number, customer_name, customer_phone, order_type, status, items, subtotal, total_amount, promotion_code) VALUES
('ORD-001', 'John Doe', '+91-9876543210', 'delivery', 'pending', 
 '[{"name": "Margherita Pizza", "quantity": 2, "price": 150.00}]'::jsonb, 
 300.00, 270.00, 'WELCOME10'),
('ORD-002', 'Jane Smith', '+91-9876543211', 'pickup', 'preparing', 
 '[{"name": "Chocolate Cake", "quantity": 1, "price": 250.00}]'::jsonb, 
 250.00, 250.00, NULL),
('ORD-003', 'Mike Johnson', '+91-9876543212', 'delivery', 'ready', 
 '[{"name": "Burger Combo", "quantity": 3, "price": 120.00}]'::jsonb, 
 360.00, 310.00, 'SAVE50')
ON CONFLICT (order_number) DO NOTHING;
```

## 🎯 **After Running the SQL:**

1. **Your admin dashboard will show real data**
2. **Edge Functions will work properly**
3. **All services will connect to actual database tables**
4. **You can test order management, customer management, and promotions**

## 🚀 **Quick Test:**
After creating the tables:
1. Refresh your admin dashboard
2. Go to `/admin/customers` - You should see the sample customers
3. Go to `/admin/promotions` - You should see the sample promotions  
4. Go to `/admin/order-management` - You should see the sample orders

**This will fix the empty data issue completely!** 🎉
