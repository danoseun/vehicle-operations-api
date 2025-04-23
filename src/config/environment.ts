export const environment = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    databaseUrl: process.env.DATABASE_URL || '',
    logLevel: process.env.LOG_LEVEL || 'info'
  };