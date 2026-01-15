import Joi from "joi"

export const ClientRegisterValidated = Joi.object({
    "username": Joi.string().required(),
    "password": Joi.string().required(),
    "address": Joi.string().required(),
    "date_of_birth": Joi.date().required(),
    "email": Joi.string().required(),
    "first_name": Joi.string().required(),
    "identification_number": Joi.string().required(),
    "last_name": Joi.string().required(),
    "phone": Joi.string().required(),
    "profile_photo": Joi.string().required(),
    "role_id": Joi.number().required(),
})