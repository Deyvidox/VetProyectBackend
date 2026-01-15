import Joi from "joi";

// Valido que los IDs existan y que el género sea exactamente Male o Female
export const ValidacionMascota = Joi.object({
    owner_id: Joi.number().integer().required(),
    species_id: Joi.number().integer().required(),
    name: Joi.string().min(2).required(),
    breed: Joi.string().allow(''), // La raza puede estar vacía
    gender: Joi.string().valid('Male', 'Female').required()
});