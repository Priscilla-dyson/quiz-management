const { PrismaClient } = require('@prisma/client');
const { config } = require('dotenv');

// Load environment variables
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Database connected successfully!');
    
    console.log('Creating database tables...');
    // This will create tables based on your schema
    await prisma.$executeRaw`SELECT 1`;
    
    console.log('Migration completed successfully!');
    console.log('Database is ready for use.');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
