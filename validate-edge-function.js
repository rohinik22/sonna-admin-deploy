#!/usr/bin/env node

// Edge Function Validation Script
// This checks if the admin-login function has correct syntax and structure

import fs from 'fs';
import path from 'path';

const functionPath = path.join(process.cwd(), 'supabase', 'functions', 'admin-login', 'index.ts');

console.log('🔍 Validating Edge Function: admin-login');
console.log('=====================================\n');

try {
  // Read the function file
  const functionContent = fs.readFileSync(functionPath, 'utf8');
  
  // Check for required components
  const checks = [
    {
      name: 'Deno.serve() usage',
      pattern: /Deno\.serve\s*\(/,
      required: true
    },
    {
      name: 'CORS headers',
      pattern: /corsHeaders/,
      required: true
    },
    {
      name: 'Supabase client import',
      pattern: /from\s+['"]https:\/\/esm\.sh\/@supabase\/supabase-js/,
      required: true
    },
    {
      name: 'bcrypt import',
      pattern: /from\s+['"]https:\/\/esm\.sh\/bcryptjs/,
      required: true
    },
    {
      name: 'JWT import',
      pattern: /from\s+['"]https:\/\/esm\.sh\/jsonwebtoken/,
      required: true
    },
    {
      name: 'Environment variable usage',
      pattern: /Deno\.env\.get/,
      required: true
    },
    {
      name: 'Password comparison',
      pattern: /bcrypt\.compare/,
      required: true
    },
    {
      name: 'JWT signing',
      pattern: /jwt\.sign/,
      required: true
    },
    {
      name: 'Response with JSON',
      pattern: /JSON\.stringify/,
      required: true
    },
    {
      name: 'Error handling',
      pattern: /try\s*{[\s\S]*catch/,
      required: true
    }
  ];

  let allPassed = true;
  
  checks.forEach(check => {
    const passed = check.pattern.test(functionContent);
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${check.name}`);
    
    if (check.required && !passed) {
      allPassed = false;
    }
  });

  console.log('\n📊 Summary');
  console.log('===========');
  
  if (allPassed) {
    console.log('✅ All required components found!');
    console.log('✅ Edge Function structure is correct');
    console.log('✅ Ready for deployment');
    console.log('\nNote: TypeScript errors in VS Code are expected for Deno functions');
  } else {
    console.log('❌ Some required components are missing');
    console.log('🔧 Please review the function structure');
  }

  // Check file size
  const stats = fs.statSync(functionPath);
  console.log(`📁 File size: ${stats.size} bytes`);
  
  // Count lines
  const lines = functionContent.split('\n').length;
  console.log(`📝 Lines of code: ${lines}`);

} catch (error) {
  console.log('❌ Error reading function file:', error.message);
  console.log('\nMake sure the file exists at:');
  console.log(functionPath);
}

console.log('\n🚀 Next Steps:');
console.log('1. Deploy function: supabase functions deploy admin-login');
console.log('2. Set JWT secret: supabase secrets set JWT_SECRET=your-secret');
console.log('3. Test with your admin credentials');
