import database from "../database.js";

export const actualizarStockProveedor = async (id, cantidad_nueva, nuevo_precio) => {
    // Cambiamos 'price' por 'unit_price' según tu esquema SQL
    const query = `
        UPDATE inventory 
        SET quantity = quantity + $1, 
            unit_price = $2,
            updated_at = NOW()
        WHERE id = $3 
        RETURNING *;
    `;
    const result = await database.query(query, [cantidad_nueva, nuevo_precio, id]);
    return result.rows[0];  
};