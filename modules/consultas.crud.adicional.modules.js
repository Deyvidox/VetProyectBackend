import database from "../database.js";

// Aquí defino la función para traer las consultas con toda su información relacionada
export const obtenerConsultasDetalladas = async () => {
    // Uso un INNER JOIN para no mostrar solo IDs, sino los nombres reales
    // de las mascotas y los veterinarios que las atendieron
    const query = `
        SELECT 
            c.id AS consulta_id,
            p.name AS nombre_mascota,
            u.first_name || ' ' || u.last_name AS veterinario, -- Concateno nombre y apellido
            c.reason AS motivo,
            c.diagnosis AS diagnostico,
            c.priority AS prioridad,
            c.status AS estado_consulta,
            c.created_at AS fecha
        FROM consultations c
        INNER JOIN pets p ON c.pet_id = p.id -- Conecto la consulta con la tabla mascotas
        INNER JOIN users u ON c.veterinarian_id = u.id -- Conecto la consulta con el usuario veterinario
        ORDER BY c.created_at DESC; -- Ordeno para que las más recientes salgan primero
    `;
    const result = await database.query(query);
    return result.rows; // Devuelvo todas las filas encontradas
};