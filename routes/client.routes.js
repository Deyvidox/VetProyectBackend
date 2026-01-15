import { Router } from "express"
import Messages from "../messages.js"
import { ClientRegisterControl } from "../controllers/client.controller.js"

const routes = Router()

routes.post("/register", ClientRegisterControl, Messages)

export default routes