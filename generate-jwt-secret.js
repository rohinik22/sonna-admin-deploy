#!/usr/bin/env node

// Generate a secure JWT secret for your .env.local file
// Run with: node generate-jwt-secret.js

import crypto from 'crypto';

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function generateBase64Secret(length = 64) {
  return crypto.randomBytes(length).toString('base64');
}

console.log('🔐 JWT Secret Generator for Sonna Admin Dashboard');
console.log('================================================\n');

console.log('Option 1 - Hexadecimal (recommended):');
console.log(`JWT_SECRET=${generateSecureSecret()}\n`);

console.log('Option 2 - Base64:');
console.log(`JWT_SECRET=${generateBase64Secret()}\n`);

console.log('Option 3 - Extra Long Hex (256 bits):');
console.log(`JWT_SECRET=${generateSecureSecret(32)}\n`);

console.log('💡 Tips:');
console.log('- Copy one of the above secrets to your .env.local file');
console.log('- Never commit this secret to version control');
console.log('- Use the same secret in your Supabase Edge Function environment');
console.log('- Generate a new secret for production deployments');

console.log('\n🚀 Next steps:');
console.log('1. Copy your chosen secret to .env.local');
console.log('2. Set the same secret in Supabase: supabase secrets set JWT_SECRET=your-secret');
console.log('3. Deploy your Edge Function: supabase functions deploy admin-login');
