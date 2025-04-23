import { z } from 'zod';
import { VehicleStatus } from '../../../shared/types';

export const vehicleSchema = z.object({
  id: z.string().uuid(),
  registrationNo: z.string().min(1).max(20),
  vehicleTypeId: z.string().uuid(),
  status: z.nativeEnum(VehicleStatus).default(VehicleStatus.AVAILABLE),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const createVehicleSchema = vehicleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  status: z.nativeEnum(VehicleStatus).default(VehicleStatus.AVAILABLE).optional()
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const vehicleFilterSchema = z.object({
  registrationNo: z.string().optional(),
  vehicleTypeId: z.string().uuid().optional(),
  status: z.nativeEnum(VehicleStatus).optional()
});

export type Vehicle = z.infer<typeof vehicleSchema>;
export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
export type VehicleFilter = z.infer<typeof vehicleFilterSchema>;