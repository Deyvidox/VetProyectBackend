import Joi from "joi"

export const ClientRegisterValidated = Joi.object({
    "username": Joi.string()
        .min(4)
        .max(50)
        .pattern(/^[A-Za-z0-9._-]+$/)
        .required()
        .messages({
            'string.empty': 'El nombre de usuario es obligatorio',
            'string.min': 'El usuario debe tener al menos 4 caracteres',
            'string.max': 'El usuario no puede exceder 50 caracteres',
            'string.pattern.base': 'Solo letras, números, puntos, guiones y guiones bajos'
        }),
    
    "password": Joi.string()
        .min(8)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
        .required()
        .messages({
            'string.empty': 'La contraseña es obligatoria',
            'string.min': 'La contraseña debe tener al menos 8 caracteres',
            'string.pattern.base': 'La contraseña debe contener al menos una letra y un número'
        }),
    
    "address": Joi.string()
        .min(5)
        .max(500)
        .required()
        .messages({
            'string.empty': 'La dirección es obligatoria',
            'string.min': 'La dirección debe tener al menos 5 caracteres',
            'string.max': 'La dirección no puede exceder 500 caracteres'
        }),
    
    "date_of_birth": Joi.date()
        .max('now')
        .required()
        .messages({
            'date.base': 'Fecha de nacimiento inválida',
            'date.max': 'La fecha no puede ser futura',
            'any.required': 'La fecha de nacimiento es obligatoria'
        }),
    
    "email": Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
            'string.empty': 'El correo es obligatorio',
            'string.email': 'Correo electrónico inválido'
        }),
    
    "first_name": Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .required()
        .messages({
            'string.empty': 'El nombre es obligatorio',
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede exceder 100 caracteres',
            'string.pattern.base': 'El nombre solo puede contener letras y espacios'
        }),
    
    "identification_number": Joi.string()
        .pattern(/^[VEJvej0-9\-\s]{5,20}$/)
        .required()
        .messages({
            'string.empty': 'El número de identificación es obligatorio',
            'string.pattern.base': 'Formato de identificación inválido. Use V/E/J seguido de números'
        }),
    
    "last_name": Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .required()
        .messages({
            'string.empty': 'El apellido es obligatorio',
            'string.min': 'El apellido debe tener al menos 2 caracteres',
            'string.max': 'El apellido no puede exceder 100 caracteres',
            'string.pattern.base': 'El apellido solo puede contener letras y espacios'
        }),
    
    "phone": Joi.string()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .required()
        .messages({
            'string.empty': 'El teléfono es obligatorio',
            'string.pattern.base': 'Formato de teléfono inválido'
        }),
    
    "profile_photo": Joi.string()
        .uri()
        .optional()
        .allow('')
        .messages({
            'string.uri': 'URL de foto de perfil inválida'
        }),
    
    "role_id": Joi.number()
        .integer()
        .min(1)
        .max(4)
        .required()
        .messages({
            'number.base': 'El ID del rol debe ser un número',
            'number.integer': 'El ID del rol debe ser un número entero',
            'number.min': 'El ID del rol debe ser al menos 1',
            'number.max': 'El ID del rol no puede ser mayor a 4',
            'any.required': 'El rol es obligatorio'
        })
})

export const UpdateUserValidated = Joi.object({
    'first_name': Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede exceder 100 caracteres',
            'string.pattern.base': 'El nombre solo puede contener letras y espacios'
        }),
    
    'last_name': Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'El apellido debe tener al menos 2 caracteres',
            'string.max': 'El apellido no puede exceder 100 caracteres',
            'string.pattern.base': 'El apellido solo puede contener letras y espacios'
        }),
    
    'username': Joi.string()
        .min(4)
        .max(50)
        .pattern(/^[A-Za-z0-9._-]+$/)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'El usuario debe tener al menos 4 caracteres',
            'string.max': 'El usuario no puede exceder 50 caracteres',
            'string.pattern.base': 'Solo letras, números, puntos, guiones y guiones bajos'
        }),
    
    'phone': Joi.string()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .optional()
        .allow('', null)
        .messages({
            'string.pattern.base': 'Formato de teléfono inválido'
        }),
    
    'address': Joi.string()
        .min(5)
        .max(500)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'La dirección debe tener al menos 5 caracteres',
            'string.max': 'La dirección no puede exceder 500 caracteres'
        }),
    
    'date_of_birth': Joi.date()
        .max('now')
        .optional()
        .allow('', null)
        .messages({
            'date.base': 'Fecha de nacimiento inválida',
            'date.max': 'La fecha no puede ser futura'
        }),
    
    'id': Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'El ID debe ser un número',
            'number.integer': 'El ID debe ser un número entero',
            'number.min': 'El ID debe ser al menos 1',
            'any.required': 'El ID es obligatorio'
        })
})

export const SearchUsersValidated = Joi.object({
    'search': Joi.string()
        .min(1)
        .max(100)
        .optional()
        .allow('', null)
        .messages({
            'string.min': 'El término de búsqueda debe tener al menos 1 carácter',
            'string.max': 'El término de búsqueda no puede exceder 100 caracteres'
        }),
    
    'limit': Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(10)
        .optional()
        .allow('', null)
        .messages({
            'number.base': 'El límite debe ser un número',
            'number.integer': 'El límite debe ser un número entero',
            'number.min': 'El límite debe ser al menos 1',
            'number.max': 'El límite no puede ser mayor a 50'
        })
})

export const GetAllUsersValidated = Joi.object({
    'page': Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            'number.base': 'La página debe ser un número',
            'number.integer': 'La página debe ser un número entero',
            'number.min': 'La página debe ser al menos 1'
        }),
    
    'limit': Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            'number.base': 'El límite debe ser un número',
            'number.integer': 'El límite debe ser un número entero',
            'number.min': 'El límite debe ser al menos 1',
            'number.max': 'El límite no puede ser mayor a 100'
        }),
    
    'status': Joi.string()
        .valid('Active', 'Inactive', 'Suspended')
        .optional()
        .messages({
            'any.only': 'El estado debe ser Active, Inactive o Suspended'
        })
})

export const DeactivateUserValidated = Joi.object({
    'id': Joi.string()
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.empty': 'El ID es obligatorio',
            'string.pattern.base': 'El ID debe contener solo números'
        })
})

export const UserIdValidated = Joi.object({
    "id": Joi.string()
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.empty': 'El ID es obligatorio',
            'string.pattern.base': 'El ID debe contener solo números'
        })
})