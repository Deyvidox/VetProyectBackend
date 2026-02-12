import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import database from "./database.js"; 
import inventoryRoutes from "./routes/inventory.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import RegisterRoutes from "./routes/register.routes.js";
import RolesRoutes from "./routes/roles.routes.js";
import LoginRoutes from "./routes/login.routes.js";
import ClientRoutes from "./routes/client.routes.js";

dotenv.config();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Carpeta temporal de uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Definición de Rutas (Asegúrate de que coincidan con el Frontend)
app.use("/api/inventory", inventoryRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/users", ClientRoutes);
app.use("/login", LoginRoutes);
app.use("/register", RegisterRoutes);
app.use("/roles", RolesRoutes);

// Verificación de inicio
try {
    await database.query("SELECT NOW()");
    console.log("✅ Conexión a PostgreSQL establecida");
    console.log("☁️  Cloudinary listo");
} catch (err) {
    console.error("❌ Error inicial:", err.message);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});