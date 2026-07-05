import { z } from "zod";

export const createOTRequestSchema = z.object({
  attendanceId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid attendance ID"),
  requestedHours: z.number().positive("Overtime hours must be greater than 0"),
  reason: z.string().min(3, "Reason must be at least 3 characters long"),
});

export const reviewOTRequestSchema = z.object({
  remarks: z.string().optional().default(""),
});
