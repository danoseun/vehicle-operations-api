import { BaseService } from '../../../shared/interfaces/services';
import { VehicleType, CreateVehicleTypeDto, UpdateVehicleTypeDto, VehicleTypeFilter } from './vehicle-type.schema';
import { VehicleTypeRepository } from './vehicle-type.repository';
import { NotFoundError, ConflictError } from '../../../shared/errors/application-error';

export interface VehicleTypeService extends BaseService<
  VehicleType, 
  CreateVehicleTypeDto, 
  UpdateVehicleTypeDto, 
  VehicleTypeFilter
> {}

export class VehicleTypeServiceImpl implements VehicleTypeService {
  constructor(private readonly repository: VehicleTypeRepository) {}


  async create(dto: CreateVehicleTypeDto): Promise<VehicleType> {
    const existingType = await this.repository.findByName(dto.name);
    if (existingType) {
      throw new ConflictError(`Vehicle type with name '${dto.name}' already exists`);
    }

    return this.repository.create(dto);
  }

  async findById(id: string): Promise<VehicleType> {
    const vehicleType = await this.repository.findById(id);
    if (!vehicleType) {
      throw new NotFoundError('Vehicle type');
    }
    return vehicleType;
  }

  async findAll(filter?: VehicleTypeFilter): Promise<VehicleType[]> {
    return this.repository.findAll(filter);
  }

  async update(id: string, dto: UpdateVehicleTypeDto): Promise<VehicleType> {
    // Check if exists
    await this.findById(id);

    // Check if name is being updated and already exists
    if (dto.name) {
      const existingType = await this.repository.findByName(dto.name);
      if (existingType && existingType.id !== id) {
        throw new ConflictError(`Vehicle type with name '${dto.name}' already exists`);
      }
    }

    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<boolean> {
    // Check if exists
    await this.findById(id);
    return this.repository.delete(id);
  }
}