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
