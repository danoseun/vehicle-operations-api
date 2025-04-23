import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyPluginAsync } from 'fastify';

const swaggerPlugin: FastifyPluginAsync = fp(async (fastify) => {
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Vehicle Operations API',
        description: 'API for managing vehicle operations',
        version: '1.0.0'
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'vehicle-types', description: 'Vehicle Type related endpoints' },
        { name: 'vehicles', description: 'Vehicle related endpoints' },
        { name: 'operations', description: 'Operation related endpoints' },
        { name: 'routes', description: 'Route related endpoints' },
        { name: 'schedules', description: 'Schedule related endpoints' }
      ]
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/documentation'
  });
});

export default swaggerPlugin;