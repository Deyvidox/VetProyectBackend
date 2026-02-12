import { check, validationResult } from "express-validator";

export const PetValidator = [
    check("name")
        .notEmpty().withMessage("El nombre es requerido"),
    check("species_id")
        .notEmpty().withMessage("Debe seleccionar una especie"),
    check("owner_id")
        .notEmpty().withMessage("El dueño es obligatorio"),
    check("gender")
        .optional()
        .isIn(['Male', 'Female', 'Unknown']).withMessage("Género no válido"),
    
    // Función que procesa los resultados de arriba (sustituye al helper)
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ 
                success: false, 
                errors: errors.array().map(err => ({ message: err.msg })) 
            });
        }
        next();
    }
];