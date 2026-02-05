import { z } from "zod";

export const AppointmentSchemaValidated = z.object({
    mascota_id: z.number({ required_error: "ID de mascota requerido" }).int(),
    veterinario_id: z.number({ required_error: "ID de veterinario requerido" }).int(),
    fecha_cita: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Formato de fecha inválido",
    }),
    estado: z.enum(['Pendiente', 'Confirmada', 'Cancelada', 'Completada']),
    notas: z.string().optional().nullable(),
    evidencia_url: z.string().url().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (data.estado === 'Cancelada' && (!data.notas || data.notas.trim().length < 5)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['notas'],
            message: "Si cancela, debe explicar el motivo (mínimo 5 caracteres)",
        });
    }
});

export const AppointmentIdValidated = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser numérico")
});