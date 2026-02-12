import { z } from "zod";

// Validamos que el ID sea un número antes de llegar a la base de datos
export const validateId = (req, res, next) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ 
            success: false, 
            message: "El ID proporcionado no es válido." 
        });
    }
    next();
};

// Validación opcional para el cuerpo del inventario (Zod)
export const inventorySchema = z.object({
    name: z.string().min(3, "Mínimo 3 caracteres"),
    type: z.enum(['Medicine', 'Vaccine', 'Accessory', 'Food', 'Other']),
    quantity: z.coerce.number().min(0),
    unit_price: z.coerce.number().min(0),
    status: z.enum(['Available', 'Out of Stock', 'Discontinued'])
});

export const validateInventoryBody = (req, res, next) => {
    try {
        // En multipart/form-data, req.body llega como strings, zod.coerce los arregla
        inventorySchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            errors: error.errors.map(e => e.message) 
        });
    }
};