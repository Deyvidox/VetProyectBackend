import express from "express";
import { listarMascotas } from "../controllers/pets.crud.adicional.controller.js";

const router = express.Router();

// Defino el endpoint GET
router.get("/listado", listarMascotas);

export default router;