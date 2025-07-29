# Sonna's Sweet Bites - Admin Interface Setup Guide

## Overview
This guide will help you set up the admin interface directly in your existing React app using Supabase client-side integration.

## Prerequisites Checklist ✅
- [x] Supabase project created
- [x] Supabase client library installed (`@supabase/supabase-js`)
- [x] Environment variables configured (`.env.local`)
- [x] Supabase client configuration created (`src/lib/supabase.ts`)
- [ ] Database tables created (next step)

## Step-by-Step Implementation

### Step 1: Execute Database Setup
1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy the entire content from `database-setup.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute
6. You should see: "Module 1 Database Setup Complete! 🎉"

### Step 2: Create Storage Bucket for Images
In your Supabase Dashboard:
1. Go to Storage
2. Click "Create Bucket"
3. Name: `menu-images`
4. Make it public: ✅ (for easy image serving)
5. Click "Create Bucket"

### Step 3: Set Up Authentication (Optional for now)
For testing, you can create a test admin user:
1. Go to Authentication > Users in Supabase
2. Click "Add User"
3. Email: `admin@sonnas.com`
4. Password: `admin123` (change later)
5. Email Confirm: ✅

### Step 4: Test Database Connection
Let's create a simple test page to verify everything works.

## Next Development Steps

### Admin Routes Structure
```
/admin
├── /dashboard     - Overview stats
├── /categories    - Manage food categories
├── /menu         - Manage menu items
├── /orders       - View and manage orders
├── /inventory    - Track stock levels
└── /settings     - App settings
```

### Essential Admin Components to Build
1. **Admin Layout** - Navigation and header
2. **Category Manager** - CRUD for categories
3. **Menu Item Manager** - CRUD for menu items with image upload
4. **Order Dashboard** - View incoming orders
5. **Quick Stats** - Revenue, popular items, etc.

## File Organization
```
src/
├── pages/
│   └── admin/
│       ├── Dashboard.tsx
│       ├── Categories.tsx
│       ├── MenuItems.tsx
│       └── Orders.tsx
├── components/
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── CategoryForm.tsx
│       ├── MenuItemForm.tsx
│       └── OrderCard.tsx
└── hooks/
    ├── useCategories.ts
    ├── useMenuItems.ts
    └── useOrders.ts
```

## Database Operations Examples

### Categories
```typescript
// Fetch all categories
const { data: categories } = await supabase
  .from('categories')
  .select('*')
  .order('sort_order');

// Create new category
const { data, error } = await supabase
  .from('categories')
  .insert({
    name: 'New Category',
    description: 'Category description',
    sort_order: 11
  });
```

### Menu Items
```typescript
// Fetch menu items with category
const { data: menuItems } = await supabase
  .from('menu_items')
  .select(`
    *,
    categories (
      id,
      name
    )
  `);

// Upload image and create menu item
const { data: uploadData } = await supabase.storage
  .from('menu-images')
  .upload(`items/${file.name}`, file);

const { data } = await supabase
  .from('menu_items')
  .insert({
    name: 'New Item',
    price: 12.99,
    category_id: categoryId,
    image_url: uploadData.path
  });
```

## Environment Variables Needed
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security Notes
- Row Level Security (RLS) is enabled on all tables
- Admin functions require `role = 'admin'` in JWT token
- For development, you can temporarily disable RLS if needed
- Images in storage bucket are public for easy serving

## Ready to Start Building!
Once you've completed the database setup, we can start building the admin interface components. The foundation is solid and ready for rapid development!

## Common Commands for Development
```bash
# Start development server
npm run dev

# Install additional dependencies as needed
npm install react-router-dom
npm install @headlessui/react
npm install react-hook-form
```
