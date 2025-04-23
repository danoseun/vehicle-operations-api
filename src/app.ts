import Fastify, { FastifyInstance } from 'fastify';
import { environment } from './config/environment';
import prismaPlugin from './plugins/prisma';
import swaggerPlugin from './plugins/swagger';
import errorHandler from './plugins/error-handler';
import vehicleTypeRoutes from './modules/vehicles/vehicle-type/vehicle-type.routes';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: environment.logLevel
    }
  });

  // Register plugins
  await app.register(prismaPlugin);
  await app.register(swaggerPlugin);
  await app.register(errorHandler);

  // Register schemas for swagger
  app.addSchema({
    $id: 'vehicleTypeSchema',
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      description: { type: ['string', 'null'] },
      capacity: { type: ['integer', 'null'] },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  });

  // Register routes
  app.register(vehicleTypeRoutes, { prefix: '/api/vehicle-types' });

  return app;
}