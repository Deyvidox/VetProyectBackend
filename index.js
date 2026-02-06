import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import database from "./database.js"; 
import inventoryRoutes from "./routes/inventory.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors()); // <--- Vital para conectar con React
app.use(express.json());

// Rutas Reales
app.use("/inventory", inventoryRoutes);
app.use("/appointments", appointmentRoutes);

// Prueba de conexión
try {
    await database.query("SELECT NOW()");
    console.log("✅ Conexión a PostgreSQL establecida exitosamente");
} catch (err) {
    console.error("❌ Error conectando a la base de datos:", err.message);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor real corriendo en http://localhost:${PORT}`);
});