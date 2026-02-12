import database from "../database.js";

// modules/pet.model.js
export const GetAllPets = async (filters) => {
    const { categoria } = filters;
    try {
        let query = `
            SELECT 
                p.id, p.name, p.breed, p.color, p.gender, p.status, p.image_url, p.species_id,
                s.name as species_name, 
                o.first_name || ' ' || o.last_name as owner_name 
            FROM public.pets p
            INNER JOIN public.species s ON p.species_id = s.id
            INNER JOIN public.users o ON p.owner_id = o.id
            WHERE 1=1
        `;
        const params = [];
        if (categoria && categoria !== 'Todas') {
            params.push(categoria);
            query += ` AND s.name = $${params.length}`;
        }
        query += " ORDER BY p.id DESC";
        const result = await database.query(query, params);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const CreatePet = async (data) => {
    const { name, owner_id, species_id, breed, date_of_birth, gender, color, status, image_url } = data;
    const query = `
        INSERT INTO public.pets 
        (name, owner_id, species_id, breed, date_of_birth, gender, color, status, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
    `;
    const values = [name, owner_id, species_id, breed, date_of_birth || null, gender, color, status, image_url];
    const result = await database.query(query, values);
    return result.rows[0];
};

export const UpdatePet = async (id, data) => {
    const { name, breed, color, status, gender, species_id, image_url } = data;
    const query = `
        UPDATE public.pets 
        SET name = COALESCE($1, name),
            breed = COALESCE($2, breed),
            color = COALESCE($3, color),
            status = COALESCE($4, status),
            gender = COALESCE($5, gender),
            species_id = COALESCE($6, species_id),
            image_url = COALESCE($7, image_url),
            updated_at = NOW()
        WHERE id = $8 RETURNING *;
    `;
    const result = await database.query(query, [name, breed, color, status, gender, species_id, image_url, id]);
    return result.rows[0];
};

export const DeletePet = async (id) => {
    // Intenta borrar físicamente. Si falla por FK, el controlador manejará el error.
    return await database.query("DELETE FROM public.pets WHERE id = $1", [id]);
};