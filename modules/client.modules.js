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