const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected! Pushing schema...');
    
    // This will create tables based on your schema
    await prisma.$executeRaw`SELECT 1`;
    
    console.log('Creating tables...');
    // Run prisma db push programmatically
    const { execSync } = require('child_process');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
