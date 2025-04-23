import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { CreateVehicleTypeDto } from '../../src/modules/vehicles/vehicle-type/vehicle-type.schema';

describe('Vehicle Type API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new vehicle type', async () => {
    const vehicleType: CreateVehicleTypeDto = {
      name: 'Sedan',
      description: 'A standard sedan vehicle',
      capacity: 5
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/vehicle-types',
      payload: vehicleType
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.name).toBe(vehicleType.name);
    expect(body.id).toBeDefined();
  });

  it('should not create a vehicle type with duplicate name', async () => {
    const vehicleType: CreateVehicleTypeDto = {
      name: 'Sedan', // This name already exists from previous test
      description: 'Another sedan',
      capacity: 4
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/vehicle-types',
      payload: vehicleType
    });

    expect(response.statusCode).toBe(409); // Conflict
  });

  it('should get all vehicle types', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/vehicle-types'
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it('should get a vehicle type by id', async () => {
    // First create a vehicle type
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/vehicle-types',
      payload: {
        name: 'SUV',
        description: 'Sport Utility Vehicle',
        capacity: 7
      }
    });
    
    const createdVehicleType = JSON.parse(createResponse.body);
    
    // Then get it by id
    const response = await app.inject({
      method: 'GET',
      url: `/api/vehicle-types/${createdVehicleType.id}`
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.id).toBe(createdVehicleType.id);
    expect(body.name).toBe('SUV');
  });
});