# 🚨 Admin Authentication Setup Fix

## Problem Identified
The admin dashboard is allowing access without proper authentication because:
1. The `admins` table doesn't exist in your database
2. No admin user has been created

## 🔧 Quick Fix - Create Admin Table & User

### Step 1: Create the Admins Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read their own data
CREATE POLICY "Admins can read own data" ON public.admins
    FOR SELECT USING (email = auth.email());

-- Create policy for service role (for Edge Functions)
CREATE POLICY "Service role full access" ON public.admins
    FOR ALL USING (auth.role() = 'service_role');
```

### Step 2: Create Your Admin User in Supabase Auth
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Enter:
   - Email: `admin@sonnas.com` (or your preferred admin email)
   - Password: `your-secure-password`
   - Confirm password
4. Click "Create User"

### Step 3: Add Admin Record to Database
Run this SQL with your admin email:

```sql
-- Insert admin record (replace with your actual admin email)
INSERT INTO public.admins (full_name, email, role)
VALUES ('Admin User', 'admin@sonnas.com', 'admin')
ON CONFLICT (email) DO NOTHING;
```

### Step 4: Verify Setup
1. Go to your admin login page: `/admin/login`
2. Use the credentials you created
3. You should now be properly authenticated

## 🛡️ Alternative Quick Fix (Temporary)
If you want to test immediately without database setup, you can temporarily bypass the admin check:

**Modify `src/lib/auth.ts`** - Replace the `isAuthenticated` method:

```typescript
async isAuthenticated(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    // TEMPORARY: Return true if any user is logged in
    if (session?.user) {
      // Set a temporary admin user
      this.user = {
        id: session.user.id,
        full_name: 'Temp Admin',
        email: session.user.email || 'admin@temp.com',
        role: 'admin'
      }
      return true
    }
    
    return false
  } catch {
    return false
  }
}
```

⚠️ **WARNING**: This temporary fix bypasses security. Use only for testing!

## 🎯 Recommended Solution
Use **Step 1-4** above to properly set up admin authentication with the database table and user creation.

## 🔍 Test Your Setup
After setup, test by:
1. Going to `/admin/login`
2. Using your admin credentials
3. Verifying you can access `/admin/dashboard`
4. Checking that Edge Functions work (they require proper admin authentication)

Your authentication should now work properly! 🎉
