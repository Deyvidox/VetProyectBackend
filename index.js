import Express from "express"
import cors from "cors"
import dotenv from "dotenv"
import LoginRoutes from "./routes/login.routes.js"
import ClientRoutes from "./routes/client.routes.js"
import petsRoutes from "./routes/pets.crud.adicional.routes.js" // Nombre corregido
import Messages from "./messages.js" // ¡IMPORTANTE AGREGAR ESTO!
import consultasRoutes from './routes/consultas.crud.adicional.routes.js'

dotenv.config()
const app = Express()

app.use(cors())
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

app.use("/login", LoginRoutes)
app.use("/clients", ClientRoutes)
app.use("/mascotas", petsRoutes)
app.use("/consultas", consultasRoutes)

// EL PEAJE FINAL: Sin esto, tu código nunca responderá a Insomnia
app.use(Messages)

app.listen(process.env.PORT, () => { console.log("Server http://localhost:" + process.env.PORT) })