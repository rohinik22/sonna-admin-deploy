<<<<<<< HEAD
-- Complete Database Setup Script for Sonna Sweet Bites Admin Dashboard
-- Run this entire script in Supabase SQL Editor

-- Enable Row Level Security (RLS) for all tables
ALTER DATABASE postgres SET timezone TO 'UTC';

-- Create the admins table (Updated for Supabase Auth)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the menu_categories table
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    prep_time_minutes INTEGER,
    allergens TEXT[],
    nutritional_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    order_type TEXT NOT NULL CHECK (order_type IN ('dine_in', 'takeaway', 'delivery', 'pickup')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    table_number INTEGER,
    delivery_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    customizations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_name TEXT NOT NULL,
    current_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
    minimum_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0,
    supplier TEXT,
    last_restocked TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON public.menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins table (Updated for Supabase Auth)
CREATE POLICY "Admins can read their own data" ON public.admins
    FOR SELECT USING (auth.email() = email);

CREATE POLICY "Admins can read all admin data" ON public.admins
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

CREATE POLICY "Admins can insert admin data" ON public.admins
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

CREATE POLICY "Admins can update admin data" ON public.admins
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

-- Create RLS policies for menu_categories table (Updated for Supabase Auth)
CREATE POLICY "Anyone can read active categories" ON public.menu_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can read all categories" ON public.menu_categories
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

CREATE POLICY "Admins can modify categories" ON public.menu_categories
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

-- Create RLS policies for menu_items table (Updated for Supabase Auth)
CREATE POLICY "Anyone can read available menu items" ON public.menu_items
    FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can read all menu items" ON public.menu_items
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

CREATE POLICY "Admins can modify menu items" ON public.menu_items
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

-- Create RLS policies for orders table (Updated for Supabase Auth)
CREATE POLICY "Admins can read all orders" ON public.orders
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

CREATE POLICY "Admins can modify orders" ON public.orders
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

-- Create RLS policies for order_items table (Updated for Supabase Auth)
CREATE POLICY "Admins can read all order items" ON public.order_items
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

CREATE POLICY "Admins can modify order items" ON public.order_items
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

-- Create RLS policies for inventory table (Updated for Supabase Auth)
CREATE POLICY "Admins can read inventory" ON public.inventory
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

CREATE POLICY "Admins can modify inventory" ON public.inventory
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.admins WHERE email = auth.email() AND role = 'admin'
    ));

-- Insert sample admin user (Updated for Supabase Auth - no password needed)
INSERT INTO public.admins (full_name, email, role) VALUES
('Admin User', 'admin@sonnas.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample menu categories
INSERT INTO public.menu_categories (name, description, display_order, is_active) VALUES
('Cakes', 'Delicious homemade cakes for all occasions', 1, true),
('Burgers', 'Juicy gourmet burgers with fresh ingredients', 2, true),
('Pizza', 'Wood-fired pizzas with authentic Italian flavors', 3, true),
('Sandwiches', 'Fresh sandwiches made to order', 4, true),
('Cold Drinks', 'Refreshing beverages and smoothies', 5, true),
('Hot Drinks', 'Coffee, tea, and warm beverages', 6, true),
('Small Bites', 'Perfect appetizers and snacks', 7, true),
('Pasta', 'Traditional and modern pasta dishes', 8, true),
('Soups & Appetizers', 'Warm soups and delicious starters', 9, true),
('House Specials', 'Chef''s signature dishes', 10, true);

-- Insert sample menu items
INSERT INTO public.menu_items (category_id, name, description, price, is_available, prep_time_minutes) VALUES
((SELECT id FROM public.menu_categories WHERE name = 'Cakes'), 'Chocolate Fudge Cake', 'Rich chocolate cake with fudge frosting', 25.99, true, 30),
((SELECT id FROM public.menu_categories WHERE name = 'Cakes'), 'Red Velvet Cake', 'Classic red velvet with cream cheese frosting', 28.99, true, 35),
((SELECT id FROM public.menu_categories WHERE name = 'Burgers'), 'Classic Beef Burger', 'Juicy beef patty with lettuce, tomato, and onion', 15.99, true, 15),
((SELECT id FROM public.menu_categories WHERE name = 'Burgers'), 'Chicken Deluxe', 'Grilled chicken breast with avocado and bacon', 17.99, true, 18),
((SELECT id FROM public.menu_categories WHERE name = 'Pizza'), 'Margherita Pizza', 'Fresh mozzarella, tomato sauce, and basil', 18.99, true, 20),
((SELECT id FROM public.menu_categories WHERE name = 'Pizza'), 'Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese', 21.99, true, 20);

-- Insert sample orders
INSERT INTO public.orders (customer_name, customer_phone, order_type, status, total_amount, notes) VALUES
('John Doe', '+1234567890', 'dine_in', 'confirmed', 45.98, 'Table 5'),
('Jane Smith', '+1987654321', 'takeaway', 'preparing', 32.99, 'Extra spicy'),
('Bob Johnson', '+1555666777', 'delivery', 'ready', 28.99, 'Apartment 3B');

-- Insert sample order items
INSERT INTO public.order_items (order_id, menu_item_id, quantity, unit_price) VALUES
((SELECT id FROM public.orders WHERE customer_name = 'John Doe'), (SELECT id FROM public.menu_items WHERE name = 'Chocolate Fudge Cake'), 1, 25.99),
((SELECT id FROM public.orders WHERE customer_name = 'John Doe'), (SELECT id FROM public.menu_items WHERE name = 'Classic Beef Burger'), 1, 15.99),
((SELECT id FROM public.orders WHERE customer_name = 'Jane Smith'), (SELECT id FROM public.menu_items WHERE name = 'Chicken Deluxe'), 1, 17.99),
((SELECT id FROM public.orders WHERE customer_name = 'Jane Smith'), (SELECT id FROM public.menu_items WHERE name = 'Margherita Pizza'), 1, 18.99);

-- Insert sample inventory items
INSERT INTO public.inventory (item_name, current_stock, minimum_stock, unit, cost_per_unit, supplier) VALUES
('Flour', 50.0, 10.0, 'kg', 2.50, 'Local Bakery Supply'),
('Ground Beef', 25.0, 5.0, 'kg', 8.99, 'Fresh Meat Co'),
('Mozzarella Cheese', 15.0, 3.0, 'kg', 12.99, 'Dairy Fresh'),
('Tomatoes', 30.0, 10.0, 'kg', 3.99, 'Farm Fresh Produce'),
('Chicken Breast', 20.0, 5.0, 'kg', 7.99, 'Poultry Plus'),
('Pizza Dough', 40.0, 10.0, 'pieces', 1.50, 'Local Bakery Supply');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create indexes for better performance
CREATE INDEX idx_admins_email ON public.admins(email);
CREATE INDEX idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_inventory_item_name ON public.inventory(item_name);
=======
-- SONNA'S CAFE - MODULE 1 DATABASE SETUP
-- Copy and paste this entire script into your Supabase SQL Editor

-- ===============================================
-- STEP 1: CREATE CORE TABLES
-- ===============================================

-- Create the categories table first
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255),
  avatar_url TEXT,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  calories INTEGER,
  allergens TEXT[],
  is_vegan BOOLEAN DEFAULT FALSE,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  prep_time INTEGER, -- minutes
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address JSONB,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  customizations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ===============================================
-- STEP 3: INSERT SAMPLE DATA
-- ===============================================

-- Insert sample categories
INSERT INTO categories (name, description, sort_order) VALUES
('Cakes', 'Delicious handcrafted cakes for every occasion', 1),
('Pizza', 'Authentic wood-fired pizzas with fresh ingredients', 2),
('Burgers', 'Juicy burgers made with premium ingredients', 3),
('Pasta', 'Traditional Italian pasta dishes', 4),
('Cold Drinks', 'Refreshing beverages to quench your thirst', 5),
('Hot Drinks', 'Warming beverages for any time of day', 6),
('Sandwiches', 'Fresh sandwiches made to order', 7),
('Small Bites', 'Perfect snacks and appetizers', 8),
('Soups & Appetizers', 'Hearty soups and delicious starters', 9),
('House Specials', 'Our signature dishes and chef recommendations', 10)
ON CONFLICT (name) DO NOTHING;

-- Insert sample menu items
WITH category_ids AS (
    SELECT id, name FROM categories WHERE name IN ('Cakes', 'Pizza', 'Burgers', 'Cold Drinks')
)
INSERT INTO menu_items (category_id, name, description, price, prep_time, is_available) 
SELECT 
    c.id,
    item.name,
    item.description,
    item.price,
    item.prep_time,
    item.available
FROM category_ids c
CROSS JOIN (
    VALUES 
        ('Chocolate Birthday Cake', 'Rich chocolate cake perfect for celebrations', 25.99, 60, true),
        ('Margherita Pizza', 'Classic pizza with fresh tomatoes and mozzarella', 12.99, 15, true),
        ('Classic Beef Burger', 'Juicy beef patty with lettuce, tomato, and cheese', 8.99, 12, true),
        ('Fresh Orange Juice', 'Freshly squeezed orange juice', 3.99, 2, true)
) AS item(name, description, price, prep_time, available)
WHERE (c.name = 'Cakes' AND item.name LIKE '%Cake%')
   OR (c.name = 'Pizza' AND item.name LIKE '%Pizza%')
   OR (c.name = 'Burgers' AND item.name LIKE '%Burger%')
   OR (c.name = 'Cold Drinks' AND item.name LIKE '%Juice%')
ON CONFLICT DO NOTHING;

-- ===============================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- STEP 5: CREATE BASIC SECURITY POLICIES
-- ===============================================

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Menu items policies (public read)
CREATE POLICY "Anyone can view available menu items" ON menu_items
    FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage menu items" ON menu_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Users policies (users can manage their own data)
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Orders policies (users can view/create their own orders)
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Order items policies (inherit from orders)
CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert order items for their orders" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all order items" ON order_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================

SELECT 'Module 1 Database Setup Complete! 🎉' as message;
>>>>>>> 591d7f5222478eb919dd6c7cd6b14aa07059e892
