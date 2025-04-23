import { VehicleTypeServiceImpl } from '../../src/modules/vehicles/vehicle-type/vehicle-type.service';
import { VehicleTypeRepository } from '../../src/modules/vehicles/vehicle-type/vehicle-type.repository';
import { CreateVehicleTypeDto, VehicleType } from '../../src/modules/vehicles/vehicle-type/vehicle-type.schema';
import { NotFoundError, ConflictError } from '../../src/shared/errors/application-error';

// Mock repository
const mockRepository: jest.Mocked<VehicleTypeRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByName: jest.fn()
};

describe('VehicleTypeService', () => {
  let service: VehicleTypeServiceImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VehicleTypeServiceImpl(mockRepository);
  });

  describe('create', () => {
    it('should create a vehicle type', async () => {
      const dto: CreateVehicleTypeDto = {
        name: 'Truck',
        description: 'Large cargo vehicle',
        capacity: 2
      };

      const expectedResult: VehicleType = {
        id: '123',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto);
      
      expect(mockRepository.findByName).toHaveBeenCalledWith(dto.name);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw ConflictError if vehicle type with same name exists', async () => {
      const dto: CreateVehicleTypeDto = {
        name: 'Truck',
        description: 'Large cargo vehicle',
        capacity: 2
      };

      const existingType: VehicleType = {
        id: '123',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.findByName.mockResolvedValue(existingType);

      await expect(service.create(dto)).rejects.toThrow(ConflictError);
      expect(mockRepository.findByName).toHaveBeenCalledWith(dto.name);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a vehicle type by id', async () => {
      const id = '123';
      const expectedResult: VehicleType = {
        id,
        name: 'Truck',
        description: 'Large cargo vehicle',
        capacity: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.findById.mockResolvedValue(expectedResult);

      const result = await service.findById(id);
      
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundError if vehicle type not found', async () => {
      const id = '123';
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundError);
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a vehicle type', async () => {
      const id = '123';
      const dto = {
        description: 'Updated description'
      };

      const existingType: VehicleType = {
        id,
        name: 'Truck',
        description: 'Large cargo vehicle',
        capacity: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const expectedResult: VehicleType = {
        ...existingType,
        description: dto.description,
        updatedAt: new Date()
      };

      mockRepository.findById.mockResolvedValue(existingType);
      mockRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, dto);
      
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundError if vehicle type to update not found', async () => {
      const id = '123';
      const dto = {
        description: 'Updated description'
      };

      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update(id, dto)).rejects.toThrow(NotFoundError);
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictError if updating name to one that already exists', async () => {
      const id = '123';
      const dto = {
        name: 'SUV'
      };

      const existingType: VehicleType = {
        id,
        name: 'Truck',
        description: 'Large cargo vehicle',
        capacity: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const conflictingType: VehicleType = {
        id: '456',
        name: 'SUV',
        description: 'Sport Utility Vehicle',
        capacity: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.findById.mockResolvedValue(existingType);
      mockRepository.findByName.mockResolvedValue(conflictingType);

      await expect(service.update(id, dto)).rejects.toThrow(ConflictError);
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.findByName).toHaveBeenCalledWith(dto.name);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a vehicle type', async () => {
      const id = '123';
      const existingType: VehicleType = {
        id,
        name: 'Truck',
        description: 'Large cargo vehicle',
        capacity: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.findById.mockResolvedValue(existingType);
      mockRepository.delete.mockResolvedValue(true);

      const result = await service.delete(id);
      
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });

    it('should throw NotFoundError if vehicle type to delete not found', async () => {
      const id = '123';
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(NotFoundError);
      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});