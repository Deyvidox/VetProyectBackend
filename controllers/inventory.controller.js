import { inventorySchema, InventoryIdValidated } from "../validates/inventory.validation.js";
import { GetAllInventory, CreateProduct, UpdateProduct, DeleteProduct } from "../modules/inventory.model.js";

export const GetAllInventoryControl = async (req, res, next) => {
    try {
        const { search } = req.query;
        const { results, data } = await GetAllInventory(search);
        req.message = {
            type: "Successfully",
            message: { context: "Inventario cargado", count: results, inventory: data },
            status: 200
        };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};

export const CreateProductControl = async (req, res, next) => {
    try {
        const validation = inventorySchema.safeParse(req.body);
        if (!validation.success) {
            req.message = { type: "Validation", message: validation.error.errors.map(e => e.message).join(", "), status: 400 };
            return next();
        }
        const { data } = await CreateProduct(validation.data);
        req.message = { type: "Successfully", message: { context: "Producto creado", data }, status: 201 };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};

export const UpdateProductControl = async (req, res, next) => {
    try {
        const idVal = InventoryIdValidated.safeParse({ id: req.params.id });
        const dataVal = inventorySchema.safeParse(req.body);
        if (!idVal.success || !dataVal.success) {
            req.message = { type: "Validation", message: "Datos inválidos", status: 400 };
            return next();
        }
        const { results, data } = await UpdateProduct(req.params.id, dataVal.data);
        if (results === 0) {
            req.message = { type: "Error", message: "Producto no encontrado", status: 404 };
            return next();
        }
        req.message = { type: "Successfully", message: { context: "Producto actualizado", data }, status: 200 };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};

export const DeleteProductControl = async (req, res, next) => {
    try {
        const { results } = await DeleteProduct(req.params.id);
        req.message = results > 0 
            ? { type: "Successfully", message: "Producto eliminado", status: 200 }
            : { type: "Error", message: "No encontrado", status: 404 };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};