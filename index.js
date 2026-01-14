import Express from "express"
import cors from "cors"
import dotenv from "dotenv"
import LoginRoutes from "./routes/login.routes.js";

dotenv.config()
const app = Express()

app.use(cors())
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))
app.use("/login", LoginRoutes)

app.listen(process.env.PORT, () => { console.log("Server http://localhost:" + process.env.PORT) })