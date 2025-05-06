import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Create Prisma client with logging enabled in development
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ]
    : ['error', 'warn'],
});

// Log queries in development mode
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

// Add cleanup on application shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});