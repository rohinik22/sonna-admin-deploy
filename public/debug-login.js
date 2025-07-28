// Quick diagnostic script to check what's wrong with the login
// Run this in browser console (F12 -> Console tab) to debug

console.log('🔍 Sonna Admin Login Diagnostics');
console.log('================================');

// Check environment variables
console.log('1. Environment Variables:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test Edge Function endpoint
const testLogin = async () => {
  console.log('\n2. Testing Edge Function:');
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-login`;
  console.log('Edge Function URL:', url);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'admin@sonnas.com',
        password: 'admin123'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Login response:', data);
    } else {
      const error = await response.text();
      console.log('❌ Error response:', error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    
    if (error.message.includes('Failed to fetch')) {
      console.log('\n🚨 DIAGNOSIS: Edge Function not deployed or CORS issue');
      console.log('Solutions:');
      console.log('1. Deploy Edge Function: supabase functions deploy admin-login');
      console.log('2. Check Supabase project is active');
      console.log('3. Verify environment variables');
    }
  }
};

// Test Supabase connection
const testSupabase = async () => {
  console.log('\n3. Testing Supabase Connection:');
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Supabase connection working');
    } else {
      console.log('❌ Supabase connection failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Supabase connection error:', error.message);
  }
};

// Run diagnostics
testSupabase();
testLogin();

console.log('\n4. Next Steps:');
console.log('If Edge Function test fails:');
console.log('- Run: supabase functions deploy admin-login');
console.log('- Check: FIX_LOGIN_ERROR.md for detailed steps');
