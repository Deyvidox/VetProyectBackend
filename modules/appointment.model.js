import database from "../database.js";

export const GetAllAppointments = async (search = '') => {
    let sql = `
        SELECT 
            a.id, 
            a.created_at AS fecha_creacion,
            a.status AS estado, 
            a.notes AS notas,
            p.name AS nombre_mascota, 
            u.first_name || ' ' || u.last_name AS nombre_cliente
        FROM appointments a
        INNER JOIN pets p ON a.pet_id = p.id
        INNER JOIN users u ON p.owner_id = u.id`;

    const params = [];
    if (search) {
        sql += ` WHERE p.name ILIKE $1 OR u.first_name ILIKE $1 OR u.last_name ILIKE $1`;
        params.push(`%${search}%`);
    }

    sql += ` ORDER BY a.created_at DESC;`;
    const { rows, rowCount } = await database.query(sql, params);
    return { results: rowCount, data: rows };
};

export const CreateAppointment = async (pet_id, status, notes) => {
    const sql = `INSERT INTO appointments (pet_id, status, notes, created_at, updated_at)
                 VALUES ($1, $2, $3, NOW(), NOW())
                 RETURNING id, status, notes;`;
    const { rows, rowCount } = await database.query(sql, [pet_id, status, notes]);
    return { results: rowCount, data: rows[0] };
};

export const UpdateAppointment = async (id, status, notes) => {
    const sql = `UPDATE appointments 
                 SET status = $1, notes = $2, updated_at = NOW()
                 WHERE id = $3 RETURNING *;`;
    const { rows, rowCount } = await database.query(sql, [status, notes, id]);
    return { results: rowCount, data: rows[0] };
};

export const DeleteAppointment = async (id) => {
    const sql = `DELETE FROM appointments WHERE id = $1 RETURNING *;`;
    const { rowCount } = await database.query(sql, [id]);
    return { results: rowCount };
};