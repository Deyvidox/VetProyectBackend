import database from "../database.js";

export const ClientRegister = async (
    password, address, date_of_birth, email, first_name,
    identification_number, last_name, phone, profile_photo,
    role_id, username
) => {
    console.log('📝 Ejecutando INSERT en tabla users...');
    
    const sql = `
        INSERT INTO users (
            password, address, date_of_birth, email, first_name,
            identification_number, last_name, phone, profile_photo,
            role_id, username, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Active', NOW(), NOW())
        RETURNING 
            id, username, email, first_name, last_name,
            identification_number, phone, address, date_of_birth,
            profile_photo, role_id, status, created_at
    `;

    const values = [
        password, address, date_of_birth, email, first_name,
        identification_number, last_name, phone, profile_photo,
        role_id, username
    ];

    console.log('📊 Valores SQL para registro:', values.map(v => v || 'NULL'));
    
    try {
        const { rows, rowCount } = await database.query(sql, values);
        console.log('✅ Registro exitoso, filas afectadas:', rowCount);
        
        return { 
            "results": rowCount, 
            "data": rows[0] 
        };
    } catch (err) {
        console.error('❌ ERROR en ClientRegister:', err.message);
        
        // Manejo de errores específicos de PostgreSQL
        if (err.code === '23505') { // Violación de unique constraint
            if (err.detail.includes('username')) {
                throw new Error('El nombre de usuario ya existe');
            } else if (err.detail.includes('email')) {
                throw new Error('El correo electrónico ya existe');
            } else if (err.detail.includes('identification_number')) {
                throw new Error('El número de identificación ya existe');
            }
        }
        
        throw err;
    }
};

export const RegisterUnique = async (identification_number, phone, username, email) => {
    console.log('🔍 Verificando unicidad de datos...');
    
    let sql = `SELECT COUNT(*) as count FROM users WHERE status = 'Active' AND (`;
    const params = [];
    let conditions = [];
    let paramIndex = 1;

    if (identification_number && identification_number.trim() !== '') {
        conditions.push(`identification_number = $${paramIndex}`);
        params.push(identification_number.trim());
        paramIndex++;
    }

    if (phone && phone.trim() !== '') {
        conditions.push(`phone = $${paramIndex}`);
        params.push(phone.trim());
        paramIndex++;
    }

    if (username && username.trim() !== '') {
        conditions.push(`username = $${paramIndex}`);
        params.push(username.trim());
        paramIndex++;
    }

    if (email && email.trim() !== '') {
        conditions.push(`email = $${paramIndex}`);
        params.push(email.trim());
        paramIndex++;
    }

    if (conditions.length === 0) {
        return { "results": 0 };
    }

    sql += conditions.join(' OR ') + ')';
    console.log('📊 SQL de verificación:', sql);
    console.log('📊 Parámetros:', params);

    try {
        const { rows } = await database.query(sql, params);
        const count = parseInt(rows[0].count);
        console.log('📊 Usuarios duplicados encontrados:', count);
        
        return { "results": count };
    } catch (err) {
        console.error('❌ ERROR en RegisterUnique:', err.message);
        throw err;
    }
};

export const UpdateUser = async (id, data) => {
    console.log('📝 Actualizando usuario ID:', id);
    console.log('📝 Datos a actualizar:', data);
    
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Construir dinámicamente la consulta UPDATE
    if (data.first_name !== undefined) {
        fields.push(`first_name = $${paramIndex}`);
        values.push(data.first_name);
        paramIndex++;
    }
    
    if (data.last_name !== undefined) {
        fields.push(`last_name = $${paramIndex}`);
        values.push(data.last_name);
        paramIndex++;
    }
    
    if (data.username !== undefined) {
        fields.push(`username = $${paramIndex}`);
        values.push(data.username);
        paramIndex++;
    }
    
    if (data.phone !== undefined) {
        fields.push(`phone = $${paramIndex}`);
        values.push(data.phone);
        paramIndex++;
    }
    
    if (data.address !== undefined) {
        fields.push(`address = $${paramIndex}`);
        values.push(data.address);
        paramIndex++;
    }
    
    if (data.date_of_birth !== undefined) {
        fields.push(`date_of_birth = $${paramIndex}`);
        values.push(data.date_of_birth);
        paramIndex++;
    }

    if (fields.length === 0) {
        throw new Error('No hay campos para actualizar');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id); // El ID va al final

    const sql = `
        UPDATE users 
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex} AND status = 'Active'
        RETURNING 
            id, username, email, first_name, last_name,
            identification_number, phone, address, date_of_birth,
            profile_photo, role_id, status, updated_at
    `;

    console.log('📊 SQL UPDATE:', sql);
    console.log('📊 Valores UPDATE:', values);

    try {
        const { rows, rowCount } = await database.query(sql, values);
        console.log('✅ Actualización exitosa, filas afectadas:', rowCount);
        
        return { 
            "results": rowCount, 
            "data": rows[0] || null 
        };
    } catch (err) {
        console.error('❌ ERROR en UpdateUser:', err.message);
        throw err;
    }
};

export const DeactivateUser = async (userId) => {
    console.log('🗑️ Desactivando usuario ID:', userId);
    
    const sql = `
        UPDATE users 
        SET status = 'Inactive', updated_at = NOW()
        WHERE id = $1 AND status = 'Active'
        RETURNING 
            id, username, email, first_name, last_name, status
    `;

    try {
        const { rows, rowCount } = await database.query(sql, [userId]);
        console.log('✅ Usuario desactivado, filas afectadas:', rowCount);
        
        return { 
            "results": rowCount, 
            "data": rows[0] || null 
        };
    } catch (err) {
        console.error('❌ ERROR en DeactivateUser:', err.message);
        throw err;
    }
};

export const SearchUsers = async (search = '', limit = 10) => {
    console.log('🔍 Buscando usuarios con término:', search);
    
    let sql = `
        SELECT 
            u.id,
            u.username,
            u.email,
            u.first_name,
            u.last_name,
            u.identification_number,
            u.phone,
            u.address,
            u.date_of_birth,
            u.profile_photo,
            u.status,
            u.created_at,
            u.updated_at,
            r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.status = 'Active'
    `;
    
    const params = [];
    
    if (search && search.trim() !== '') {
        sql += ` AND (
            u.username ILIKE $1 OR 
            u.email ILIKE $1 OR 
            u.first_name ILIKE $1 OR 
            u.last_name ILIKE $1 OR
            u.identification_number ILIKE $1 OR
            u.phone ILIKE $1
        )`;
        params.push(`%${search.trim()}%`);
    }
    
    sql += ` ORDER BY u.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    console.log('📊 SQL SEARCH:', sql);
    console.log('📊 Parámetros SEARCH:', params);

    try {
        const { rows, rowCount } = await database.query(sql, params);
        console.log('✅ Usuarios encontrados:', rowCount);
        
        return { 
            "results": rowCount, 
            "data": rows 
        };
    } catch (err) {
        console.error('❌ ERROR en SearchUsers:', err.message);
        throw err;
    }
};

export const GetAllUsers = async (page = 1, limit = 10, status = null) => {
    console.log('📋 Obteniendo todos los usuarios. Página:', page, 'Límite:', limit, 'Status:', status);
    
    const offset = (page - 1) * limit;
    
    let sql = `
        SELECT 
            u.id,
            u.username,
            u.email,
            u.first_name,
            u.last_name,
            u.identification_number,
            u.phone,
            u.address,
            u.date_of_birth,
            u.profile_photo,
            u.status,
            u.created_at,
            u.updated_at,
            r.name as role_name,
            r.permissions as role_permissions
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
    `;
    
    const params = [];
    
    if (status) {
        sql += ` WHERE u.status = $1`;
        params.push(status);
    }
    
    // SQL para contar total
    const countSql = `SELECT COUNT(*) as total FROM users u ${status ? 'WHERE u.status = $1' : ''}`;
    
    sql += ` ORDER BY u.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    console.log('📊 SQL GET ALL:', sql);
    console.log('📊 Parámetros GET ALL:', params);

    try {
        // Ejecutar ambas consultas en paralelo
        const [usersResult, countResult] = await Promise.all([
            database.query(sql, params),
            database.query(countSql, status ? [status] : [])
        ]);

        const total = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(total / limit);

        console.log('✅ Usuarios obtenidos:', usersResult.rowCount, 'de', total);

        return {
            "results": usersResult.rowCount,
            "data": usersResult.rows,
            "pagination": {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    } catch (err) {
        console.error('❌ ERROR en GetAllUsers:', err.message);
        throw err;
    }
};

export const GetUserById = async (userId) => {
    console.log('🔍 Obteniendo usuario por ID:', userId);
    
    const sql = `
        SELECT 
            u.id,
            u.username,
            u.email,
            u.first_name,
            u.last_name,
            u.identification_number,
            u.phone,
            u.address,
            u.date_of_birth,
            u.profile_photo,
            u.status,
            u.created_at,
            u.updated_at,
            r.name as role_name,
            r.id as role_id,
            r.permissions as role_permissions
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.id = $1 AND u.status = 'Active'
    `;

    try {
        const { rows, rowCount } = await database.query(sql, [userId]);
        console.log('✅ Usuario encontrado:', rowCount > 0);
        
        if (rowCount === 0) {
            return null;
        }
        
        return rows[0];
    } catch (err) {
        console.error('❌ ERROR en GetUserById:', err.message);
        throw err;
    }
};