import { z } from "zod";

export const punchInSchema = z.object({
  selfie: z.string().min(1, "Selfie photo is required"),
  location: z.object({
    latitude: z.number({ required_error: "Latitude is required" }),
    longitude: z.number({ required_error: "Longitude is required" }),
  }),
});

export const verifyAttendanceSchema = z.object({
  status: z.enum(["valid", "invalid"], {
    errorMap: () => ({ message: "Status must be either 'valid' or 'invalid'" }),
  }),
  remarks: z.string().optional().default(""),
});
