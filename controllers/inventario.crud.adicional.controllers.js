import { actualizarStockProveedor } from "../modules/inventario.crud.adicional.modules.js";

export const registrarEntradaProveedor = async (req, res, next) => {
    // Log para depuración (mira tu consola de VS Code)
    console.log("Datos recibidos en el controlador:", req.body);

    // Si el validador ya marcó un error, saltar al final
    if (req.message && req.message.type === 'Error') {
        return next();
    }

    try {
        const { id, cantidad_nueva, nuevo_precio } = req.body;
        const productoActualizado = await actualizarStockProveedor(id, cantidad_nueva, nuevo_precio);

        if (!productoActualizado) {
            req.message = {
                type: 'Error',
                message: 'El producto con ID ' + id + ' no existe en la base de datos',
                status: 404
            };
        } else {
            req.message = {
                type: 'Éxito',
                message: `Stock actualizado. Producto: ${productoActualizado.name} | Nuevo total: ${productoActualizado.quantity}`,
                status: 200
            };
        }
        next(); 
    } catch (error) {
        req.message = { 
            type: 'Error', 
            message: "Error de servidor SQL: " + error.message, 
            status: 500 
        };
        next();
    }
};