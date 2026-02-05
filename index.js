import Express from "express"
import cors from "cors"
import dotenv from "dotenv"

import LoginRoutes from "./routes/login.routes.js"
import ClientRoutes from "./routes/client.routes.js"
<<<<<<< Updated upstream
import petsRoutes from "./routes/pets.crud.adicional.routes.js"
import consultasRoutes from './routes/consultas.crud.adicional.routes.js'
import inventarioRoutes from './routes/inventario.crud.adicional.routes.js'
import Messages from "./messages.js"
=======
// Importamos el nuevo módulo de citas
import AppointmentRoutes from "./routes/appointment.routes.js" 
>>>>>>> Stashed changes

dotenv.config()
const app = Express()

// Middlewares obligatorios antes de las rutas
app.use(cors())
app.use(Express.json()) 
app.use(Express.urlencoded({ extended: true }))

// Endpoints principales
app.use("/login", LoginRoutes)
app.use("/clients", ClientRoutes)
<<<<<<< Updated upstream
app.use("/mascotas", petsRoutes)
app.use("/consultas", consultasRoutes)
app.use("/inventario", inventarioRoutes)

app.use(Messages)
=======
// Cambiamos mascotas por citas para que el servidor no explote
app.use("/appointments", AppointmentRoutes) 
>>>>>>> Stashed changes

app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Usamos un fallback por si el .env no carga el puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { 
    console.log("🚀 Servidor listo en http://localhost:" + PORT) 
})