import { z } from 'zod';

export const vehicleTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  capacity: z.number().int().positive().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const createVehicleTypeSchema = vehicleTypeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const updateVehicleTypeSchema = createVehicleTypeSchema.partial();

export const vehicleTypeFilterSchema = z.object({
  name: z.string().optional()
});

export type VehicleType = z.infer<typeof vehicleTypeSchema>;
export type CreateVehicleTypeDto = z.infer<typeof createVehicleTypeSchema>;
export type UpdateVehicleTypeDto = z.infer<typeof updateVehicleTypeSchema>;
export type VehicleTypeFilter = z.infer<typeof vehicleTypeFilterSchema>;