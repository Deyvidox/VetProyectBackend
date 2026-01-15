import database from "../database.js";

// Mi lógica: Consulto la tabla pets pero traigo los nombres de las llaves foráneas con INNER JOIN
export const obtenerMascotasRelacionadas = async () => {
    const consulta = `
        SELECT p.id, p.name AS nombre_mascota, s.name AS especie, u.first_name AS dueño
        FROM pets p
        INNER JOIN species s ON p.species_id = s.id
        INNER JOIN users u ON p.owner_id = u.id;
    `;
    const resultado = await database.query(consulta);
    return resultado.rows; // Devuelvo solo las filas encontradas
};