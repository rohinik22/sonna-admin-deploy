# 🚀 Quick Fix: Mock Data for Testing

If you want to test the admin dashboard immediately without setting up the database, here's a quick fix:

## Option 1: Create Minimal Tables (Recommended)

Run this minimal SQL in Supabase SQL Editor:

```sql
-- Quick minimal tables for testing
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    loyalty_points INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    used_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable service role access
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access users" ON public.users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access orders" ON public.orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access promotions" ON public.promotions FOR ALL USING (auth.role() = 'service_role');

-- Test data
INSERT INTO public.users (email, full_name, phone, loyalty_points, total_orders, total_spent) VALUES
('test@customer.com', 'Test Customer', '+91-1234567890', 100, 2, 500.00);

INSERT INTO public.orders (order_number, customer_name, customer_phone, status, items, total_amount) VALUES
('TEST-001', 'Test Customer', '+91-1234567890', 'pending', '[{"name": "Test Pizza", "quantity": 1, "price": 200}]'::jsonb, 200.00);

INSERT INTO public.promotions (code, name, discount_type, discount_value, valid_from) VALUES
('TEST10', 'Test Promotion', 'percentage', 10.00, NOW());
```

## Option 2: Use Mock Data in Frontend (Temporary)

Update the services to return mock data when database is empty. This is useful for immediate testing.

**Quick Test:**
After running the minimal SQL, your dashboard should show the test data!
