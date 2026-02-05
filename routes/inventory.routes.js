import { Router } from "express";
import Messages from "../messages.js";
import { 
    GetAllInventoryControl, 
    CreateProductControl, 
    UpdateProductControl, 
    DeleteProductControl 
} from "../controllers/inventory.controller.js";

const routes = Router();

routes.get("/", GetAllInventoryControl, Messages);
routes.post("/", CreateProductControl, Messages);
routes.put("/:id", UpdateProductControl, Messages);
routes.delete("/:id", DeleteProductControl, Messages);

export default routes;