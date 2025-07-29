// Simple test server to simulate backend functionality
import http from 'http';
import url from 'url';

// Mock admin data for testing
const mockAdmin = {
  id: '1',
  email: 'admin@sonna.com',
  password: 'admin123', // In real app, this would be hashed
  full_name: 'Admin User',
  role: 'admin',
  status: 'active'
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Content-Type': 'application/json'
};

// Mock JWT token generation
function generateMockJWT(admin) {
  // This is a mock JWT - in real app, use proper JWT library
  const payload = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
  };
  return `mock-jwt-token-${Buffer.from(JSON.stringify(payload)).toString('base64')}`;
}

// Request handler
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Set CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route: Admin Login
  if (path === '/functions/v1/admin-login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);

        // Validate input
        if (!email || !password) {
          res.writeHead(400);
          res.end(JSON.stringify({
            message: 'Email and password are required',
            error: 'MISSING_CREDENTIALS'
          }));
          return;
        }

        // Check credentials
        if (email === mockAdmin.email && password === mockAdmin.password) {
          const token = generateMockJWT(mockAdmin);
          res.writeHead(200);
          res.end(JSON.stringify({
            message: 'Login successful',
            token: token,
            user: {
              id: mockAdmin.id,
              email: mockAdmin.email,
              full_name: mockAdmin.full_name,
              role: mockAdmin.role,
              status: mockAdmin.status
            }
          }));
        } else {
          res.writeHead(401);
          res.end(JSON.stringify({
            message: 'Invalid credentials',
            error: 'INVALID_CREDENTIALS'
          }));
        }
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({
          message: 'Invalid JSON in request body',
          error: 'INVALID_JSON'
        }));
      }
    });
    return;
  }

  // Route: Health check
  if (path === '/health' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      message: 'Sonna Admin Backend Test Server is running',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Route: Not found
  res.writeHead(404);
  res.end(JSON.stringify({
    message: 'Endpoint not found',
    error: 'NOT_FOUND',
    availableEndpoints: [
      'POST /functions/v1/admin-login',
      'GET /health'
    ]
  }));
}

// Create and start server
const server = http.createServer(handleRequest);
const PORT = 54321;

server.listen(PORT, () => {
  console.log(`🚀 Sonna Admin Backend Test Server running on http://localhost:${PORT}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/functions/v1/admin-login`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`\n✅ Server is ready for Postman testing!`);
  console.log(`\n📋 Test credentials:`);
  console.log(`   Email: admin@sonna.com`);
  console.log(`   Password: admin123`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
