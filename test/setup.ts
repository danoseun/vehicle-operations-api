import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// Setup global before all tests
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/vehicle_ops_test';
  
  // Setup test database
  try {
    // Reset the test database
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  // Clean up any resources if needed
  const prisma = new PrismaClient();
  await prisma.$disconnect();
});