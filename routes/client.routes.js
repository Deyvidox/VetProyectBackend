import { Router } from "express"
import Messages from "../messages.js"
import { ClientRegisterControl, DeactivateUserControl, GetAllUsersControl, GetUserByIdControl, SearchUsersControl, UpdateUserControl } from "../controllers/client.controller.js"

const routes = Router()

routes.post("/register", ClientRegisterControl, Messages)
routes.post("/update/:id", UpdateUserControl, Messages)
routes.delete("/delete/:id", DeactivateUserControl, Messages)
routes.post("/search", SearchUsersControl, Messages)
routes.get("/users", GetAllUsersControl, Messages)
routes.get("/search/:id", GetUserByIdControl, Messages)



export default routes