import express from "express";
import dotenv from "dotenv";
import database from "./database.js"; // IMPORTANTE: Solo un punto (.)
import inventoryRoutes from "./routes/inventory.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use("/inventory", inventoryRoutes);
app.use("/appointments", appointmentRoutes);

// Prueba de conexión a la base de datos
try {
    await database.query("SELECT NOW()");
    console.log("✅ Conexión a PostgreSQL establecida");
} catch (err) {
    console.error("❌ Error conectando a la base de datos:", err.message);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});