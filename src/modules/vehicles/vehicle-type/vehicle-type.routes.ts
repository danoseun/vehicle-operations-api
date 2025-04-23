import { FastifyInstance } from 'fastify';
import { VehicleTypeController } from './vehicle-type.controller';
import { VehicleTypeServiceImpl } from './vehicle-type.service';
import { PrismaVehicleTypeRepository } from './vehicle-type.repository';
import { createVehicleTypeSchema, updateVehicleTypeSchema, vehicleTypeFilterSchema } from './vehicle-type.schema';

export default async function vehicleTypeRoutes(fastify: FastifyInstance): Promise<void> {
  const repository = new PrismaVehicleTypeRepository(fastify.prisma);
  const service = new VehicleTypeServiceImpl(repository);
  const controller = new VehicleTypeController(service);

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      tags: ['vehicle-types'],
      body: createVehicleTypeSchema,
      response: {
        201: { $ref: 'vehicleTypeSchema#' }
      }
    },
    handler: controller.create.bind(controller)
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: {
      tags: ['vehicle-types'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: { $ref: 'vehicleTypeSchema#' }
      }
    },
    handler: controller.findById.bind(controller)
  });

  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      tags: ['vehicle-types'],
      querystring: vehicleTypeFilterSchema,
      response: {
        200: {
          type: 'array',
          items: { $ref: 'vehicleTypeSchema#' }
        }
      }
    },
    handler: controller.findAll.bind(controller)
  });

  fastify.route({
    method: 'PATCH',
    url: '/:id',
    schema: {
      tags: ['vehicle-types'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: updateVehicleTypeSchema,
      response: {
        200: { $ref: 'vehicleTypeSchema#' }
      }
    },
    handler: controller.update.bind(controller)
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      tags: ['vehicle-types'],
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
}