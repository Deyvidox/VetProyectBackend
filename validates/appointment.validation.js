import { z } from "zod";

export const appointmentSchema = z.object({
    pet_id: z.number().int().positive("ID de mascota inválido"),
    status: z.enum(['Pending', 'Confirmed', 'Cancelled', 'Completed']).default('Pending'),
    notes: z.string().optional().nullable(),
});

export const AppointmentIdValidated = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser numérico")
});