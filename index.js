import Express from "express"
import cors from "cors"
import dotenv from "dotenv"

import LoginRoutes from "./routes/login.routes.js"
import ClientRoutes from "./routes/client.routes.js"
import petsRoutes from "./routes/pets.crud.adicional.routes.js"
import consultasRoutes from './routes/consultas.crud.adicional.routes.js'
import inventarioRoutes from './routes/inventario.crud.adicional.routes.js'
import Messages from "./messages.js"

dotenv.config()
const app = Express()

// Middlewares obligatorios antes de las rutas
app.use(cors())
app.use(Express.json()) 
app.use(Express.urlencoded({ extended: true }))

app.use("/login", LoginRoutes)
app.use("/clients", ClientRoutes)
app.use("/mascotas", petsRoutes)
app.use("/consultas", consultasRoutes)
app.use("/inventario", inventarioRoutes)

app.use(Messages)

const PORT_APP = process.env.PORT || 4000
app.listen(PORT_APP, () => { 
    console.log("🚀 Servidor listo en http://localhost:" + PORT_APP) 
})