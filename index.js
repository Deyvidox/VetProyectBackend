import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import database from "./database.js"; // IMPORTANTE: Solo un punto (.)
import inventoryRoutes from "./routes/inventory.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import RegisterRoutes from "./routes/register.routes.js"
import RolesRoutes from "./routes/roles.routes.js"



// Configuración de variables de entorno
dotenv.config();
import LoginRoutes from "./routes/login.routes.js"
import ClientRoutes from "./routes/client.routes.js"
const app = express();

app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use("/inventory", inventoryRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/users", ClientRoutes);
app.use("/login", LoginRoutes);
app.use("/register", RegisterRoutes);
app.use("/roles", RolesRoutes);

/* app.use("/pets", petsRoutes);
app.use("consultas", consultasRoutes);
app.use(); */


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