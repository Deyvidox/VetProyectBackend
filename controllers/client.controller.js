import bcrypt from "bcrypt"
import { 
    ClientRegisterValidated, 
    SearchUsersValidated, 
    UpdateUserValidated, 
    UserIdValidated 
} from "../validates/client.validation.js"
import { 
    ClientRegister, 
    DeactivateUser, 
    GetAllUsers, 
    GetUserById, 
    RegisterUnique, 
    SearchUsers, 
    UpdateUser 
} from "../modules/client.modules.js"

export const ClientRegisterControl = async (req, res, next) => {
    console.log('📥 ======= NUEVA SOLICITUD DE REGISTRO DE CLIENTE =======');
    console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
    
    try {
        // 1. Validación con Joi
        console.log('🔍 1. Iniciando validación Joi...');
        const { error, value } = ClientRegisterValidated.validate(req.body);

        if (error) {
            console.log('❌ Validación Joi fallida:', error.details);
            const errorMessages = error.details.map(d => d.message).join(', ');
            req.message = { 
                "type": "Validation", 
                "message": errorMessages, 
                "status": 400 
            }
            console.log('📤 Enviando respuesta de error de validación');
            return next()
        }
        
        console.log('✅ 1. Validación Joi exitosa');

        // 2. Verificar unicidad de datos
        console.log('🔍 2. Verificando unicidad de datos...');
        const unique = await RegisterUnique(
            value.identification_number, 
            value.phone, 
            value.username, 
            value.email
        );

        if (unique.results > 0) {
            console.log('❌ Datos duplicados encontrados');
            req.message = {
                "type": "Conflict", 
                "message": "Ya existe un usuario con estos datos (identificación, teléfono, usuario o correo)",
                "status": 400
            }
            return next()
        }
        console.log('✅ 2. Datos únicos verificados');

        // 3. Hashear contraseña
        console.log('🔐 3. Hasheando contraseña...');
        const hash = await bcrypt.hash(value.password, 10);
        console.log('✅ 3. Contraseña hasheada');

        // 4. Registrar usuario
        console.log('📝 4. Registrando usuario en base de datos...');
        const { results, data } = await ClientRegister(
            hash, value.address, value.date_of_birth,
            value.email, value.first_name, value.identification_number, value.last_name,
            value.phone, value.profile_photo, value.role_id, value.username
        );

        if (results === 0) {
            console.log('❌ No se pudo registrar el usuario');
            req.message = {
                type: "Error", 
                message: "No se pudo registrar el usuario", 
                status: 400 
            }
            return next()
        }

        console.log('🎉 4. Usuario registrado exitosamente:', data.id);
        req.message = {
            type: "Successfully", 
            message: {
                context: "Registro completado exitosamente",
                count: results, 
                user: {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    fullName: `${data.first_name} ${data.last_name}`,
                    roleId: data.role_id,
                    createdAt: data.created_at
                }
            },
            status: 201
        }
        console.log('📤 ======= REGISTRO DE CLIENTE COMPLETADO =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR NO CONTROLADO en ClientRegisterControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = { 
            type: "Error", 
            message: err.message, 
            status: 400 
        }
        return next()
    }
}

export const UpdateUserControl = async (req, res, next) => {
    console.log('📥 ======= ACTUALIZACIÓN DE USUARIO =======');
    console.log('📥 ID usuario:', req.params.id);
    console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
    
    try {
        // 1. Validación con Joi
        console.log('🔍 1. Validando datos de actualización...');
        const { error } = UpdateUserValidated.validate({
            'first_name': req.body.first_name || '',
            'last_name': req.body.last_name || '',
            'username': req.body.username || '',
            'phone': req.body.phone || '',
            'address': req.body.address || '',
            'date_of_birth': req.body.date_of_birth || '',
            'id': req.params.id
        });

        if (error) {
            console.log('❌ Validación fallida:', error.details);
            req.message = { 
                "type": "Validation", 
                "message": error.details.map(d => d.message).join(', '), 
                "status": 400 
            }
            return next()
        }
        console.log('✅ 1. Validación exitosa');

        // 2. Verificar si el usuario existe
        console.log('🔍 2. Verificando existencia del usuario...');
        const user = await GetUserById(req.params.id);

        if (!user) {
            console.log('❌ Usuario no encontrado');
            req.message = {
                "type": "NotFound",
                "message": "Usuario no encontrado",
                "status": 404
            }
            return next()
        }
        console.log('✅ 2. Usuario encontrado:', user.username);

        // 3. Actualizar usuario
        console.log('📝 3. Actualizando usuario...');
        const { results, data } = await UpdateUser(req.params.id, req.body);

        if (results == 0) {
            console.log('❌ No se pudo actualizar el usuario');
            req.message = {
                "type": "Error",
                "message": "No se pudo actualizar el usuario",
                "status": 404
            }
            return next()
        }

        console.log('✅ 3. Usuario actualizado exitosamente');
        req.message = {
            type: "Successfully",
            message: {
                context: "Usuario actualizado exitosamente",
                user: data
            },
            status: 200
        }
        console.log('📤 ======= ACTUALIZACIÓN COMPLETADA =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR en UpdateUserControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}

export const DeactivateUserControl = async (req, res, next) => {
    console.log('📥 ======= DESACTIVACIÓN DE USUARIO =======');
    console.log('📥 ID usuario:', req.params.id);
    
    try {
        const userId = req.params.id;

        if (!userId) {
            console.log('❌ ID de usuario no proporcionado');
            req.message = {
                "type": "Validation",
                "message": "Se requiere el ID del usuario",
                "status": 400
            }
            return next()
        }

        console.log('🔍 Validando ID de usuario...');
        const { error } = UserIdValidated.validate({ "id": userId });
        
        if (error) {
            console.log('❌ ID inválido:', error.details);
            req.message = {
                "type": "Validation",
                "message": "ID de usuario inválido",
                "status": 400
            }
            return next()
        }

        console.log('🗑️ Desactivando usuario...');
        const result = await DeactivateUser(userId);

        if (result.results === 0) {
            console.log('❌ Usuario no encontrado o ya desactivado');
            req.message = {
                "type": "NotFound",
                "message": "Usuario no encontrado o ya desactivado",
                "status": 404
            }
            return next()
        }

        console.log('✅ Usuario desactivado exitosamente');
        req.message = {
            type: "Successfully",
            message: {
                context: "Usuario desactivado exitosamente",
                user: result.data
            },
            status: 200
        }
        console.log('📤 ======= DESACTIVACIÓN COMPLETADA =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR en DeactivateUserControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}

export const SearchUsersControl = async (req, res, next) => {
    console.log('📥 ======= BÚSQUEDA DE USUARIOS =======');
    console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
    
    try {
        const { error, value } = SearchUsersValidated.validate(req.body)

        if (error) {
            console.log('❌ Validación fallida:', error.details);
            req.message = {
                "type": "Validation",
                "message": error.details.map(d => d.message).join(', '),
                "status": 400
            }
            return next()
        }

        console.log('🔍 Buscando usuarios con término:', value.search || '(vacío)');
        const { results, data } = await SearchUsers(value.search, value.limit);

        if (results == 0) {
            console.log('ℹ️ No se encontraron usuarios');
            req.message = {
                "type": "Successfully",
                "message": {
                    context: "No se encontraron usuarios",
                    count: 0,
                    users: []
                },
                "status": 200
            }
            return next()
        }

        console.log('✅ Usuarios encontrados:', results);
        req.message = {
            type: "Successfully",
            message: {
                context: "Búsqueda completada exitosamente",
                count: results,
                users: data
            },
            status: 200
        }
        console.log('📤 ======= BÚSQUEDA COMPLETADA =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR en SearchUsersControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}

export const GetAllUsersControl = async (req, res, next) => {
    console.log('📥 ======= OBTENIENDO TODOS LOS USUARIOS =======');
    console.log('📥 Query params:', req.query);
    
    try {
        const { page, limit, status } = req.query;

        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const statusFilter = status || null;

        if (pageNum < 1) {
            console.log('❌ Número de página inválido');
            req.message = {
                "type": "Validation",
                "message": "El número de página debe ser mayor a 0",
                "status": 400
            }
            return next()
        }

        if (limitNum < 1 || limitNum > 100) {
            console.log('❌ Límite inválido');
            req.message = {
                "type": "Validation",
                "message": "El límite debe estar entre 1 y 100",
                "status": 400
            }
            return next()
        }

        if (statusFilter && !['Active', 'Inactive', 'Suspended'].includes(statusFilter)) {
            console.log('❌ Filtro de estado inválido:', statusFilter);
            req.message = {
                "type": "Validation",
                "message": "Filtro de estado inválido. Use: Active, Inactive o Suspended",
                "status": 400
            }
            return next()
        }

        console.log('📋 Obteniendo usuarios...');
        console.log('📊 Parámetros:', { page: pageNum, limit: limitNum, status: statusFilter });
        
        const result = await GetAllUsers(pageNum, limitNum, statusFilter);

        console.log('✅ Usuarios obtenidos:', result.data.length);
        req.message = {
            type: "Successfully",
            message: {
                context: "Usuarios obtenidos exitosamente",
                count: result.data.length,
                pagination: result.pagination,
                users: result.data
            },
            status: 200
        }
        console.log('📤 ======= OBTENCIÓN COMPLETADA =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR en GetAllUsersControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}

export const GetUserByIdControl = async (req, res, next) => {
    console.log('📥 ======= OBTENIENDO USUARIO POR ID =======');
    console.log('📥 ID usuario:', req.params.id);
    
    try {
        const { error, value } = UserIdValidated.validate({ "id": req.params.id })

        if (error) {
            console.log('❌ Validación de ID fallida');
            req.message = {
                "type": "Validation",
                "message": "Se requiere un ID de usuario válido",
                "status": 400
            }
            return next()
        }

        console.log('🔍 Buscando usuario ID:', value.id);
        const user = await GetUserById(value.id);

        if (!user) {
            console.log('❌ Usuario no encontrado');
            req.message = {
                "type": "NotFound",
                "message": "Usuario no encontrado",
                "status": 404
            }
            return next()
        }

        console.log('✅ Usuario encontrado:', user.username);
        req.message = {
            type: "Successfully",
            message: {
                context: "Usuario obtenido exitosamente",
                user: user
            },
            status: 200
        }
        console.log('📤 ======= OBTENCIÓN COMPLETADA =======\n');
        return next()

    } catch (err) {
        console.error('🔥 ERROR en GetUserByIdControl:', err);
        console.error('🔥 Stack trace:', err.stack);
        
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}