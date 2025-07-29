// Test script for the backend endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:54321';

async function testHealthEndpoint() {
  console.log('🔍 Testing Health Endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health endpoint response:', data);
    return true;
  } catch (error) {
    console.error('❌ Health endpoint failed:', error.message);
    return false;
  }
}

async function testAdminLogin(email, password) {
  console.log(`🔍 Testing Admin Login with email: ${email}...`);
  try {
    const response = await fetch(`${BASE_URL}/functions/v1/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log(`${response.ok ? '✅' : '❌'} Login response (${response.status}):`, data);
    return response.ok;
  } catch (error) {
    console.error('❌ Login request failed:', error.message);
    return false;
  }
}

async function testCORSPreflight() {
  console.log('🔍 Testing CORS Preflight...');
  try {
    const response = await fetch(`${BASE_URL}/functions/v1/admin-login`, {
      method: 'OPTIONS'
    });
    console.log('✅ CORS preflight response:', response.status, response.headers.get('Access-Control-Allow-Origin'));
    return true;
  } catch (error) {
    console.error('❌ CORS preflight failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Backend API Tests...\n');
  
  // Test 1: Health endpoint
  await testHealthEndpoint();
  console.log();
  
  // Test 2: CORS preflight
  await testCORSPreflight();
  console.log();
  
  // Test 3: Valid login
  await testAdminLogin('admin@sonna.com', 'admin123');
  console.log();
  
  // Test 4: Invalid login
  await testAdminLogin('wrong@email.com', 'wrongpassword');
  console.log();
  
  // Test 5: Missing credentials
  await testAdminLogin('', '');
  console.log();
  
  console.log('🎉 All tests completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Import the postman-collection.json file into Postman');
  console.log('2. Test the endpoints using the collection');
  console.log('3. Verify all responses match expected behavior');
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}
