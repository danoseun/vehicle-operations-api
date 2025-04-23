import { FastifyInstance } from 'fastify';
import { VehicleController } from './vehicle.controller';
import { VehicleServiceImpl } from './vehicle.service';
import { PrismaVehicleRepository } from './vehicle.repository';
import { VehicleTypeServiceImpl } from '../vehicle-type/vehicle-type.service';
import { PrismaVehicleTypeRepository } from '../vehicle-type/vehicle-type.repository';
import { createVehicleSchema, updateVehicleSchema, vehicleFilterSchema } from './vehicle.schema';

export default async function vehicleRoutes(fastify: FastifyInstance): Promise<void> {
  const vehicleTypeRepository = new PrismaVehicleTypeRepository(fastify.prisma);
  const vehicleTypeService = new VehicleTypeServiceImpl(vehicleTypeRepository);
  
  const repository = new PrismaVehicleRepository(fastify.prisma);
  const service = new VehicleServiceImpl(repository, vehicleTypeService);
  const controller = new VehicleController(service);

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      tags: ['vehicles'],
      body: createVehicleSchema,
      response: {
        201: { $ref: 'vehicleSchema#' }
      }
    },
    handler: controller.create.bind(controller)
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['vehicles'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: { $ref: 'vehicleSchema#' }
      }
    },
    handler: controller.findById.bind(controller)
  });

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['vehicles'],
      querystring: vehicleFilterSchema,
      response: {
        200: {
          type: 'array',
          items: { $ref: 'vehicleSchema#' }
        }
      }
    },
    handler: controller.findAll.bind(controller)
  });

  fastify.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      tags: ['vehicles'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: updateVehicleSchema,
      response: {
        200: { $ref: 'vehicleSchema#' }
      }
    },
    handler: controller.update.bind(controller)
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      tags: ['vehicles'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        204: { type: 'null' }
      }
    },
    handler: controller.delete.bind(controller)
  });

  fastify.route({
    method: 'GET',
    url: '/by-type/:vehicleTypeId',
    schema: {
      tags: ['vehicles'],
      params: {
        type: 'object',
        properties: {
          vehicleTypeId: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: {
          type: 'array',
          items: { $ref: 'vehicleSchema#' }
        }
      }
    },
    handler: controller.findByVehicleType.bind(controller)
  });
}