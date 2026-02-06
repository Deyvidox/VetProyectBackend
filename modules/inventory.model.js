import database from "../database.js";

export const GetAllInventory = async (search = '') => {
    let sql = `
        SELECT 
            id, 
            name AS nombre, 
            type AS tipo, 
            instructions AS instrucciones, 
            quantity AS cantidad, 
            unit_price AS precio_unitario, 
            status AS estado,
            created_at
        FROM inventory`;
    
    const params = [];
    if (search) {
        // Buscamos en nombre y convertimos el tipo (enum) a texto para comparar
        sql += ` WHERE name ILIKE $1 OR type::text ILIKE $1`;
        params.push(`%${search}%`);
    }

    sql += ` ORDER BY id ASC;`;
    const { rows, rowCount } = await database.query(sql, params);
    return { results: rowCount, data: rows };
};

export const CreateProduct = async (data) => {
    const { nombre, tipo, instrucciones, cantidad, precio_unitario, estado } = data;
    const sql = `
        INSERT INTO inventory (name, type, instructions, quantity, unit_price, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id, name AS nombre, type AS tipo, quantity AS cantidad, unit_price AS precio_unitario, status AS estado;`;
    
    const { rows } = await database.query(sql, [nombre, tipo, instrucciones, cantidad, precio_unitario, estado]);
    return { results: 1, data: rows[0] };
};

export const UpdateProduct = async (id, data) => {
    const { nombre, tipo, instrucciones, cantidad, precio_unitario, estado } = data;
    const sql = `
        UPDATE inventory 
        SET name = $1, type = $2, instructions = $3, quantity = $4, unit_price = $5, status = $6, updated_at = NOW()
        WHERE id = $7
        RETURNING id, name AS nombre, type AS tipo, quantity AS cantidad, unit_price AS precio_unitario, status AS estado;`;
    
    const { rows, rowCount } = await database.query(sql, [nombre, tipo, instrucciones, cantidad, precio_unitario, estado, id]);
    return { results: rowCount, data: rows[0] };
};

export const DeleteProduct = async (id) => {
    const sql = `DELETE FROM inventory WHERE id = $1 RETURNING *;`;
    const { rowCount } = await database.query(sql, [id]);
    return { results: rowCount };
};