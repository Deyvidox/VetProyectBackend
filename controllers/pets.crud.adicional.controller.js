// Verifica que los nombres de las carpetas sean exactos (modules y validates)
import { obtenerMascotasRelacionadas } from "../modules/pets.crud.adicional.modules.js";
import { ValidacionMascota } from "../validates/pets.crud.adicional.validates.js";

export const listarMascotas = async (req, res, next) => {
    try {
        const resultado = await obtenerMascotasRelacionadas();
        req.message = { 
            "type": "Éxito", 
            "message": resultado, 
            "status": 200 
        };
        next();
    } catch (err) {
        req.message = { "type": "Error", "message": err.message, "status": 500 };
        next();
    }
};