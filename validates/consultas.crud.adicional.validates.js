import { check, validationResult } from 'express-validator';

// Aquí preparo las reglas para asegurar que los datos que recibo sean correctos
export const validarConsultaId = [
    // Verifico que si envían un ID, este sea realmente un número entero
    check('id')
        .optional()
        .isInt().withMessage('El ID enviado no es un número válido'),
    (req, res, next) => {
        // Reviso si las reglas de arriba encontraron errores
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Si todo está limpio, dejo pasar la petición
    }
];