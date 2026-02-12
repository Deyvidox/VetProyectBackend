import { Router } from "express";
import * as PetController from "../controllers/pet.controller.js";
import { PetValidator } from "../validates/pet.validation.js";
// IMPORTANTE: Importa tu configuración personalizada desde libs
import upload from "../libs/upload.js"; 

const router = Router();

// Obtener todas las mascotas (incluye filtro por categorías)
router.get("/", PetController.GetAllPetsControl);

// Crear: Ahora usa 'upload' que viene de tu carpeta libs
router.post(
    "/", 
    upload.single("image"), // Aquí se procesa la imagen según tus reglas en libs
    PetValidator, 
    PetController.CreatePetControl
);

// Actualizar
router.put(
    "/:id", 
    upload.single("image"), 
    PetValidator, 
    PetController.UpdatePetControl
);

router.delete("/:id", PetController.DeletePetControl);

export default router;