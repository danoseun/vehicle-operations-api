import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../../shared/interfaces/controllers';
import { VehicleService } from './vehicle.service';
import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleFilterSchema,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleFilter
} from './vehicle.schema';

export class VehicleController implements BaseController {
  constructor(private readonly service: VehicleService) {}

  async create(
    request: FastifyRequest<{ Body: CreateVehicleDto }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const data = createVehicleSchema.parse(request.body);
    const result = await this.service.create(data);
    return reply.status(201).send(result);
  }

  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { id } = request.params;
    const result = await this.service.findById(id);
    return reply.send(result);
  }

  async findAll(
    request: FastifyRequest<{ Querystring: VehicleFilter }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const filter = vehicleFilterSchema.parse(request.query);
    const result = await this.service.findAll(filter);
    return reply.send(result);
  }

  async update(
    request: FastifyRequest<{ Params: { id: string }, Body: UpdateVehicleDto }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { id } = request.params;
    const data = updateVehicleSchema.parse(request.body);
    const result = await this.service.update(id, data);
    return reply.send(result);
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { id } = request.params;
    await this.service.delete(id);
    return reply.status(204).send();
  }

  async findByVehicleType(
    request: FastifyRequest<{ Params: { vehicleTypeId: string } }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { vehicleTypeId } = request.params;
    const result = await this.service.findByVehicleType(vehicleTypeId);
    return reply.send(result);
  }
}