import Joi from "joi";

export const EntradaStockValidated = Joi.object({
    "id": Joi.number().integer().required(),
    "cantidad_nueva": Joi.number().positive().required(),
    "nuevo_precio": Joi.number().positive().required()
});

export const validarEntradaStock = (req, res, next) => {
    // Si no hay body, enviamos error de una vez
    if (!req.body || Object.keys(req.body).length === 0) {
        req.message = { type: 'Error', message: 'Cuerpo de petición vacío', status: 400 };
        return next();
    }

    const { error } = EntradaStockValidated.validate(req.body);
    if (error) {
        req.message = {
            type: 'Error',
            message: error.details[0].message,
            status: 400
        };
        return next(); 
    }
    next();
};