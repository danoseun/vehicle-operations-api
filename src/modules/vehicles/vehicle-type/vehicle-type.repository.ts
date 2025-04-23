import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../shared/interfaces/repositories';
import { VehicleType, VehicleTypeFilter } from './vehicle-type.schema';

export interface VehicleTypeRepository extends BaseRepository<VehicleType, VehicleTypeFilter> {}

export class PrismaVehicleTypeRepository implements VehicleTypeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(vehicleType: Omit<VehicleType, 'id' | 'createdAt' | 'updatedAt'>): Promise<VehicleType> {
    return this.prisma.vehicleType.create({
      data: vehicleType
    });
  }

  async findById(id: string): Promise<VehicleType | null> {
    return this.prisma.vehicleType.findUnique({
      where: { id }
    });
  }

  async findAll(filter?: VehicleTypeFilter): Promise<VehicleType[]> {
    const where = filter ? {
      name: filter.name ? { contains: filter.name, mode: 'insensitive' as const } : undefined
    } : {};

    return this.prisma.vehicleType.findMany({
      where,
      orderBy: { name: 'asc' }
    });
  }

  async update(id: string, vehicleType: Partial<VehicleType>): Promise<VehicleType> {
    return this.prisma.vehicleType.update({
      where: { id },
      data: vehicleType
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.vehicleType.delete({
      where: { id }
    });
    return true;
  }

  async findByName(name: string): Promise<VehicleType | null> {
    return this.prisma.vehicleType.findUnique({
      where: { name }
    });
  }
}