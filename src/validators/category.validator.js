import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a hex code like #ff5722').optional()
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').optional(),
  color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a hex code like #ff5722').optional()
});