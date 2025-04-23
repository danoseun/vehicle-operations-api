import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../shared/interfaces/repositories';
import { Vehicle, VehicleFilter } from './vehicle.schema';

export interface VehicleRepository extends BaseRepository<Vehicle, VehicleFilter> {
  findByRegistrationNo(registrationNo: string): Promise<Vehicle | null>;
  findByVehicleType(vehicleTypeId: string): Promise<Vehicle[]>;
}

export class PrismaVehicleRepository implements VehicleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    return this.prisma.vehicle.create({
      data: vehicle,
      include: {
        vehicleType: true
      }
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        vehicleType: true
      }
    });
  }

  async findAll(filter?: VehicleFilter): Promise<Vehicle[]> {
    const where = filter ? {
      registrationNo: filter.registrationNo ? { contains: filter.registrationNo, mode: 'insensitive' as const } : undefined,
      vehicleTypeId: filter.vehicleTypeId,
      status: filter.status
    } : {};

    return this.prisma.vehicle.findMany({
      where,
      include: {
        vehicleType: true
      },
      orderBy: { registrationNo: 'asc' }
    });
  }

  async update(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    return this.prisma.vehicle.update({
      where: { id },
      data: vehicle,
      include: {
        vehicleType: true
      }
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.vehicle.delete({
      where: { id }
    });
    return true;
  }

  async findByRegistrationNo(registrationNo: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({
      where: { registrationNo },
      include: {
        vehicleType: true
      }
    });
  }

  async findByVehicleType(vehicleTypeId: string): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      where: { vehicleTypeId },
      include: {
        vehicleType: true
      }
    });
  }
}