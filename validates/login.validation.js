import Joi from "joi"

export const LoginValidated = Joi.object({
    "username": Joi.string().required(),
    "password": Joi.string().required()
})