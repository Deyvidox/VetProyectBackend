import database from "../database.js";

export const GetAllAppointments = async () => {
    const sql = `
        SELECT a.id, a.pet_id AS mascota_id, a.veterinarian_id, 
               a.appointment_date AS fecha_cita, a.status AS estado, a.notes AS notas,
               p.name AS mascota_nombre, 
               u.first_name || ' ' || u.last_name AS vet_nombre
        FROM appointments AS a
        JOIN pets AS p ON a.pet_id = p.id
        JOIN users AS u ON a.veterinarian_id = u.id
        ORDER BY a.appointment_date DESC;`;

    const { rows, rowCount } = await database.query(sql);
    return { "results": rowCount, "data": rows };
};

export const CreateAppointment = async (mascota_id, veterinario_id, fecha_cita, estado, notas) => {
    const sql = `INSERT INTO appointments(pet_id, veterinarian_id, appointment_date, status, notes, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                 RETURNING *;`;

    const { rowCount, rows } = await database.query(sql, [
        mascota_id, veterinario_id, fecha_cita, estado, notas
    ]);

    return { "results": rowCount, "data": rows[0] };
};

export const UpdateAppointment = async (id, mascota_id, veterinario_id, fecha_cita, estado, notas) => {
    const sql = `UPDATE appointments 
                 SET pet_id = $1, veterinarian_id = $2, appointment_date = $3, 
                     status = $4, notes = $5, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $6
                 RETURNING *;`;

    const { rowCount, rows } = await database.query(sql, [
        mascota_id, veterinario_id, fecha_cita, estado, notas, id
    ]);

    return { "results": rowCount, "data": rows[0] };
};

export const DeleteAppointment = async (id) => {
    const sql = `DELETE FROM appointments WHERE id = $1 RETURNING *;`;
    const { rowCount, rows } = await database.query(sql, [id]);
    return { "results": rowCount, "data": rows[0] };
};