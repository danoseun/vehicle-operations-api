import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../../../shared/interfaces/repositories';
import { Operation, OperationFilter, OperationRequirement } from './operation.schema';
import { OperationStatus } from '../../../shared/types';

export interface OperationRepository extends BaseRepository<Operation, OperationFilter> {
  findByVehicleType(vehicleTypeId: string): Promise<Operation[]>;
  addRequirement(operationId: string, requirement: OperationRequirement): Promise<Operation>;
  removeRequirement(operationId: string, vehicleTypeId: string): Promise<boolean>;
  updateRequirement(operationId: string, requirement: OperationRequirement): Promise<Operation>;
}

export class PrismaOperationRepository implements OperationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(operation: Omit<Operation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Operation> {
    const { requirements, ...operationData } = operation;
    
    return this.prisma.operation.create({
      data: {
        ...operationData,
        requirements: {
          create: requirements.map(req => ({
            vehicleTypeId: req.vehicleTypeId,
            quantity: req.quantity
          }))
        }
      },
      include: {
        requirements: {
          include: {
            vehicleType: true
          }
        }
      }
    });
  }

  async findById(id: string): Promise<Operation | null> {
    return this.prisma.operation.findUnique({
      where: { id },
      include: {
        requirements: {
          include: {
            vehicleType: true
          }
        }
      }
    });
  }

  async findAll(filter?: OperationFilter): Promise<Operation[]> {
    const where: any = {};
    
    if (filter?.name) {
      where.name = { contains: filter.name, mode: 'insensitive' as const };
    }
    
    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.vehicleTypeId) {
      where.requirements = {
        some: {
          vehicleTypeId: filter.vehicleTypeId
        }
      };
    }

    return this.prisma.operation.findMany({
      where,
      include: {
        requirements: {
          include: {
            vehicleType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, operation: Partial<Operation>): Promise<Operation> {
    const { requirements, ...operationData } = operation;

    // If requirements are provided, we need to handle them separately
    if (requirements) {
      // First delete all existing requirements
      await this.prisma.operationRequirement.deleteMany({
        where: { operationId: id }
      });

      // Then create new ones
      for (const req of requirements) {
        await this.prisma.operationRequirement.create({
          data: {
            operationId: id,
            vehicleTypeId: req.vehicleTypeId,
            quantity: req.quantity
          }
        });
      }
    }

    // Update the operation basic data
    return this.prisma.operation.update({
      where: { id },
      data: operationData,
      include: {
        requirements: {
          include: {
            vehicleType: true
          }
        }
      }
    });
  }

  async delete(id: string): Promise<boolean> {
    // Operation requirements will be automatically deleted due to cascade delete
    await this.prisma.operation.delete({
      where: { id }
    });
    return true;
  }

  async findByVehicleType(vehicleTypeId: string): Promise<Operation[]> {
    return this.prisma.operation.findMany({
      where: {
        requirements: {
          some: {
            vehicleTypeId
          }
        }
      },
      include: {
        requirements: {
          include: {
            vehicleType: true
          }
        }
      }
    });
  }

  async addRequirement(operationId: string, requirement: OperationRequirement): Promise<Operation> {
    // Check if requirement for this vehicle type already exists
    const existing = await this.prisma.operationRequirement.findFirst({
      where: {
        operationId,
        vehicleTypeId: requirement.vehicleTypeId
      }
    });

    if (existing) {
      // Update existing requirement
      await this.prisma.operationRequirement.update({
        where: {
          id: existing.id
        },
        data: {
          quantity: requirement.quantity
        }
      });
    } else {
      // Create new requirement
      await this.prisma.operationRequirement.create({
        data: {
          operationId,
          vehicleTypeId: requirement.vehicleTypeId,
          quantity: requirement.quantity
        }
      });
    }

    // Return updated operation
    return this.findById(operationId) as Promise<Operation>;
  }

  async removeRequirement(operationId: string, vehicleTypeId: string): Promise<boolean> {
    const result = await this.prisma.operationRequirement.deleteMany({
      where: {
        operationId,
        vehicleTypeId
      }
    });
    
    return result.count > 0;
  }

  async updateRequirement(operationId: string, requirement: OperationRequirement): Promise<Operation> {
    await this.prisma.operationRequirement.updateMany({
      where: {
        operationId,
        vehicleTypeId: requirement.vehicleTypeId
      },
      data: {
        quantity: requirement.quantity
      }
    });

    return this.findById(operationId) as Promise<Operation>;
  }
}