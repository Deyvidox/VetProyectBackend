import { obtenerConsultasDetalladas } from "../modules/consultas.crud.adicional.modules.js";

export const listarConsultasAdicional = async (req, res, next) => {
    try {
        const consultas = await obtenerConsultasDetalladas();

        // Ajustado para que coincida con tu Messages.js:
        // Usamos 'message' porque tu middleware no reconoce 'content' ni 'data'
        req.message = {
            type: 'Éxito',
            message: consultas, // Enviamos los datos directamente aquí para que se vean
            status: 200
        };
        next();
    } catch (error) {
        console.error("Error en CRUD Consultas:", error);
        req.message = {
            type: 'Error',
            message: error.message,
            status: 500
        };
        next();
    }
};