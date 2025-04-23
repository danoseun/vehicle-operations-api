import { z } from 'zod';
import { OperationStatus } from '../../../shared/types';

// Operation Requirement Schema
export const operationRequirementSchema = z.object({
  vehicleTypeId: z.string().uuid(),
  quantity: z.number().int().positive()
});

export const operationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  status: z.nativeEnum(OperationStatus).default(OperationStatus.PLANNING),
  requirements: z.array(operationRequirementSchema),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const createOperationSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  status: z.nativeEnum(OperationStatus).default(OperationStatus.PLANNING).optional(),
  requirements: z.array(operationRequirementSchema).min(1, "At least one vehicle type requirement is required")
});

export const updateOperationSchema = createOperationSchema.partial().extend({
  requirements: z.array(operationRequirementSchema).optional()
});

export const operationFilterSchema = z.object({
  name: z.string().optional(),
  status: z.nativeEnum(OperationStatus).optional(),
  vehicleTypeId: z.string().uuid().optional()
});

export type OperationRequirement = z.infer<typeof operationRequirementSchema>;
export type Operation = z.infer<typeof operationSchema>;
export type CreateOperationDto = z.infer<typeof createOperationSchema>;
export type UpdateOperationDto = z.infer<typeof updateOperationSchema>;
export type OperationFilter = z.infer<typeof operationFilterSchema>;