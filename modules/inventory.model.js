import database from "../database.js";

// Obtener inventario con filtros funcionales (Búsqueda y Categoría)
export const GetAllInventory = async (filters = {}) => {
    const { search, type, id } = filters;
    let sql = `SELECT * FROM public.inventory WHERE 1=1`;
    const params = [];

    if (id) {
        params.push(id);
        sql += ` AND id = $${params.length}`;
    } else {
        if (search) {
            params.push(`%${search}%`);
            sql += ` AND name ILIKE $${params.length}`;
        }
        if (type && type !== "") {
            params.push(type);
            sql += ` AND type = $${params.length}`;
        }
    }
    sql += ` ORDER BY id DESC;`;
    const { rows } = await database.query(sql, params);
    return rows;
};

// Crear nuevo producto
export const CreateProduct = async (d) => {
    const sql = `INSERT INTO public.inventory (name, type, instructions, quantity, unit_price, status, image_url) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
    
    const values = [
        d.name, 
        d.type, 
        d.instructions || "", 
        parseInt(d.quantity), 
        parseFloat(d.unit_price), 
        d.status, 
        d.image_url || null
    ];
    const { rows } = await database.query(sql, values);
    return rows[0];
};

// Actualizar producto (Manejo de campos nulos y conversión de tipos)
export const UpdateProduct = async (id, d) => {
    const sql = `
        UPDATE public.inventory 
        SET name = COALESCE($1, name), 
            type = COALESCE($2, type), 
            instructions = COALESCE($3, instructions), 
            quantity = COALESCE($4, quantity), 
            unit_price = COALESCE($5, unit_price), 
            status = COALESCE($6, status), 
            image_url = COALESCE($7, image_url),
            updated_at = NOW()
        WHERE id = $8 
        RETURNING *;
    `;
    const values = [
        d.name || null, 
        d.type || null, 
        d.instructions || null, 
        d.quantity ? parseInt(d.quantity) : null, 
        d.unit_price ? parseFloat(d.unit_price) : null, 
        d.status || null, 
        d.image_url || null, 
        id
    ];
    const { rows } = await database.query(sql, values);
    return rows[0];
};

export const GetProductById = async (id) => {
    const { rows } = await database.query(`SELECT * FROM public.inventory WHERE id = $1;`, [id]);
    return rows[0];
};

export const DeleteProduct = async (id) => {
    return await database.query(`DELETE FROM public.inventory WHERE id = $1;`, [id]);
};