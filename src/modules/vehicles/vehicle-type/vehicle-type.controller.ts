import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from '../../../shared/interfaces/controllers';
import { VehicleTypeService } from './vehicle-type.service';
import { 
  createVehicleTypeSchema, 
  updateVehicleTypeSchema, 
  vehicleTypeFilterSchema,
  CreateVehicleTypeDto,
  UpdateVehicleTypeDto,
  VehicleTypeFilter
} from './vehicle-type.schema';

export class VehicleTypeController implements BaseController {
  constructor(private readonly service: VehicleTypeService) {}

  async create(
    request: FastifyRequest<{ Body: CreateVehicleTypeDto }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const data = createVehicleTypeSchema.parse(request.body);
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
    request: FastifyRequest<{ Querystring: VehicleTypeFilter }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const filter = vehicleTypeFilterSchema.parse(request.query);
    const result = await this.service.findAll(filter);
    return reply.send(result);
  }

  async update(
    request: FastifyRequest<{ Params: { id: string }, Body: UpdateVehicleTypeDto }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { id } = request.params;
    const data = updateVehicleTypeSchema.parse(request.body);
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
}