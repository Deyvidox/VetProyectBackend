import express from "express";
import { listarMascotas } from "../controllers/pets.crud.adicional.controller.js";
import Messages from "../messages.js";

const router = express.Router();

// Defino el endpoint GET
router.get("/listado", listarMascotas, Messages);

export default router;