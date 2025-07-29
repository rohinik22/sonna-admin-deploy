# Backend API Documentation

This is a simple backend API for Sonna Admin Dashboard that can be tested with Postman.

## Available Endpoints

### 1. Admin Login
**POST** `/admin-login`

Authenticates admin users and returns JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "full_name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active"
  }
}
```

## Testing with Postman

1. Start Supabase local development:
   ```bash
   supabase start
   ```

2. The API will be available at: `http://localhost:54321/functions/v1/`

3. Test endpoints:
   - **Admin Login**: POST `http://localhost:54321/functions/v1/admin-login`

## Environment Setup

Make sure you have the following environment variables in your `.env.local`:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

## Database Setup

Run the database setup script to create necessary tables:
```bash
psql -h localhost -p 54322 -U postgres -d postgres -f database-setup.sql
```
