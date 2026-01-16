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

export const UpdateUserValidated = Joi.object({
    'first_name': Joi.string().allow("", null).optional(),
    'last_name': Joi.string().allow("", null).optional(),
    'username': Joi.string().allow("", null).optional(),
    'phone': Joi.string().allow("", null).optional(),
    'address': Joi.string().allow("", null).optional(),
    'date_of_birth': Joi.date().allow("", null).optional(),
    'id': Joi.number().required()
})

export const SearchUsersValidated = Joi.object({
    'search': Joi.string().allow("", null).optional(),
    'limit': Joi.number().min(1).max(50).default(10).allow("", null).optional()
})

export const GetAllUsersValidated = Joi.object({
    'page': Joi.number().min(1).default(1),
    'limit': Joi.number().min(1).max(100).default(10),
    'status': Joi.string().valid('Active', 'Inactive', 'Pending').optional()
})

export const DeactivateUserValidated = Joi.object({
    'id': Joi.string().pattern(/^[0-9]+$/).required()
})

export const UserIdValidated = Joi.object({
    "id": Joi.string().pattern(/^[0-9]+$/).required()
})