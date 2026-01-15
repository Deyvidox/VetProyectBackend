import Express from "express"
import cors from "cors"
import dotenv from "dotenv"
import LoginRoutes from "./routes/login.routes.js";
import ClientRoutes from "./routes/client.routes.js"

dotenv.config()
const app = Express()

app.use(cors())
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))
app.use("/login", LoginRoutes)
app.use("/clients", ClientRoutes)

app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() })
})

app.listen(process.env.PORT, () => { console.log("Server http://localhost:" + process.env.PORT) })