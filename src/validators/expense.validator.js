import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createExpenseSchema = z.object({
  category: z.string().regex(objectIdRegex, 'Invalid category ID'),
  amount: z.number().positive('Amount must be greater than 0'),
  note: z.string().trim().max(500, 'Note is too long').optional(),
  date: z.coerce.date().optional()
});

export const updateExpenseSchema = z.object({
  category: z.string().regex(objectIdRegex, 'Invalid category ID').optional(),
  amount: z.number().positive('Amount must be greater than 0').optional(),
  note: z.string().trim().max(500, 'Note is too long').optional(),
  date: z.coerce.date().optional()
});

export const listExpensesQuerySchema = z.object({
  category: z.string().regex(objectIdRegex, 'Invalid category ID').optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
});