import { z } from "zod";

export const inventorySchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    tipo: z.enum(['Medicine', 'Vaccine', 'Accessory', 'Food', 'Other']),
    instrucciones: z.string().optional().nullable(),
    cantidad: z.number().int().min(0, "La cantidad no puede ser negativa"),
    precio_unitario: z.number().min(0, "El precio no puede ser negativo"),
    estado: z.enum(['Available', 'Out of Stock', 'Discontinued']),
    tags: z.array(z.string()).optional().default([]),
    imagen_url: z.string().url().or(z.literal('')).optional()
});

export const InventoryIdValidated = z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser numérico")
});