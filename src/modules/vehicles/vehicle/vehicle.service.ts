import { BaseService } from '../../../shared/interfaces/services';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto, VehicleFilter } from './vehicle.schema';
import { VehicleRepository } from './vehicle.repository';
import { NotFoundError, ConflictError } from '../../../shared/errors/application-error';
import { VehicleTypeService } from '../vehicle-type/vehicle-type.service';

export interface VehicleService extends BaseService<
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleFilter
> {
  findByVehicleType(vehicleTypeId: string): Promise<Vehicle[]>;
}

export class VehicleServiceImpl implements VehicleService {
  constructor(
    private readonly repository: VehicleRepository,
    private readonly vehicleTypeService: VehicleTypeService
  ) {}

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    // Check if vehicle type exists
    await this.vehicleTypeService.findById(dto.vehicleTypeId);

    // Check if registration number already exists
    const existingVehicle = await this.repository.findByRegistrationNo(dto.registrationNo);
    if (existingVehicle) {
      throw new ConflictError(`Vehicle with registration '${dto.registrationNo}' already exists`);
    }

    return this.repository.create(dto);
  }

  async findById(id: string): Promise<Vehicle> {
    const vehicle = await this.repository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle');
    }
    return vehicle;
  }

  async findAll(filter?: VehicleFilter): Promise<Vehicle[]> {
    return this.repository.findAll(filter);
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    // Check if vehicle exists
    await this.findById(id);

    // If vehicle type is being updated, check if it exists
    if (dto.vehicleTypeId) {
      await this.vehicleTypeService.findById(dto.vehicleTypeId);
    }

    // If registration is being updated, check for duplicates
    if (dto.registrationNo) {
      const existingVehicle = await this.repository.findByRegistrationNo(dto.registrationNo);
      if (existingVehicle && existingVehicle.id !== id) {
        throw new ConflictError(`Vehicle with registration '${dto.registrationNo}' already exists`);
      }
    }

    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<boolean> {
    // Check if vehicle exists
    await this.findById(id);
    return this.repository.delete(id);
  }

  async findByVehicleType(vehicleTypeId: string): Promise<Vehicle[]> {
    // Check if vehicle type exists
    await this.vehicleTypeService.findById(vehicleTypeId);
    return this.repository.findByVehicleType(vehicleTypeId);
  }
}