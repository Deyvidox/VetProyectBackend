import database from "../database.js"

export const RegisterUnique = async (identification_number, phone, username, email) => {
    const sql = `SELECT u.id FROM users AS u
    WHERE u.identification_number = $1 OR u.phone = $2
    OR u.username = $3 OR u.email = $4;`

    const { rowCount } = await database.query(sql, [
        identification_number, phone, username, email
    ])

    return { "results": rowCount }
}

export const ClientRegister = async (password, address, date_of_birth, email, first_name,
    identification_number, last_name, phone, profile_photo, role_id, username) => {
    const sql = `INSERT INTO users("password", address, date_of_birth, created_at, email,
    first_name, identification_number, last_name, phone, profile_photo, role_id, 
    status, updated_at, username)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6, $7, $8, $9, $10, 'Active', 
    CURRENT_TIMESTAMP, $11)
    RETURNING *;`

    const { rowCount, rows } = await database.query(sql, [
        password, address, date_of_birth, email, first_name, identification_number,
        last_name, phone, profile_photo, role_id, username
    ])

    return { "results": rowCount, "data": rows[0] }
}
export const UpdateUser = async (userId, updateData) => {
    let fields = [];
    let values = [];
    let paramCount = 1;

    const allowedFields = ['first_name', 'last_name', 'username', 'phone', 'address', 'date_of_birth'];

    allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
            fields.push(`${field} = $${paramCount}`);
            values.push(updateData[field]);
            paramCount++;
        }
    });

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (fields.length === 1) {
        throw new Error("There are no fields to update");
    }

    values.push(userId);

    const sql = `UPDATE users 
                 SET ${fields.join(', ')}
                 WHERE id = $${paramCount}
                 RETURNING *;`;

    const { rowCount, rows } = await database.query(sql, values);

    return { results: rowCount, data: rows[0] }
}
export const DeactivateUser = async (userId) => {
    const sql = `UPDATE users 
                 SET status = 'Inactive', updated_at = CURRENT_TIMESTAMP
                 WHERE id = $1
                 RETURNING *;`;

    const { rowCount, rows } = await database.query(sql, [userId]);

    return {
        "results": rowCount,
        "data": rows[0]
    };
}
export const SearchUsers = async (searchTerm, limit) => {
    let sql = `SELECT id, first_name, last_name, email, username, phone, status FROM users `
    let params = []

    if (searchTerm) {
        sql += `WHERE (LOWER(first_name) LIKE LOWER($${params.length + 1}) OR 
        LOWER(last_name) LIKE LOWER($${params.length + 2}) OR
        LOWER(email) LIKE LOWER($${params.length + 3}) OR 
        LOWER(username) LIKE LOWER($${params.length + 4})) `

        const searchValue = `%${searchTerm}%`;
        params.push(searchValue, searchValue, searchValue, searchValue)
    }

    sql += `LIMIT $${params.length + 1};`
    params.push(limit)

    const { rows, rowCount } = await database.query(sql, params);

    return { "results": rowCount, "data": rows };
}
export const GetAllUsers = async (page = 1, limit = 10, status = null) => {
    const offset = (page - 1) * limit;

    let sql = `SELECT id, first_name, last_name, email, username, phone, 
                      identification_number, status, role_id, created_at
               FROM users 
               WHERE 1=1`;

    let params = [];
    let paramCount = 1;

    if (status) {
        sql += ` AND status = $${paramCount}`;
        params.push(status);
        paramCount++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const { rows } = await database.query(sql, params);

    const countSql = `SELECT COUNT(*) FROM users ${status ? 'WHERE status = $1' : ''}`;
    const countParams = status ? [status] : [];
    const { rows: countRows } = await database.query(countSql, countParams);
    const total = parseInt(countRows[0].count);

    return {
        "data": rows,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "totalPages": Math.ceil(total / limit)
        }
    };
}

export const GetUserById = async (userId) => {
    const sql = `SELECT id, first_name, last_name, email, username, phone,
                        identification_number, address, date_of_birth, profile_photo,
                        status, role_id, created_at, updated_at
                 FROM users 
                 WHERE id = $1;`;

    const { rowCount, rows } = await database.query(sql, [userId]);

    if (rowCount === 0) {
        return null;
    }

    return rows[0];
}