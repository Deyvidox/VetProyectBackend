import { Router } from "express";
import { 
    GetAllInventoryControl, 
    CreateProductControl, 
    UpdateProductControl, 
    DeleteProductControl, 
    GetByIdInventoryControl 
} from "../controllers/inventory.controller.js";
import upload from "../libs/upload.js"; 
import { validateId } from "../validates/inventory.validation.js";

const router = Router();

// 1. Obtener todos (Maneja ?search=... y ?type=... para los filtros)
router.get("/", GetAllInventoryControl);

// 2. Obtener uno por ID (Usamos el validador de ID)
router.get("/:id", validateId, GetByIdInventoryControl);

// 3. Crear Producto (Imagen obligatoria u opcional según tu regla, aquí Multer procesa 'imagen')
router.post("/", upload.single("imagen"), CreateProductControl);

// 4. Actualizar Producto (Maneja actualización parcial y nueva imagen si existe)
router.put("/:id", validateId, upload.single("imagen"), UpdateProductControl);

// 5. Eliminar Producto
router.delete("/:id", validateId, DeleteProductControl);

export default router;