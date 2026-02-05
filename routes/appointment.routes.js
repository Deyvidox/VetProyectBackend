import { Router } from "express";
import Messages from "../messages.js";
import { 
    CreateAppointmentControl, 
    DeleteAppointmentControl, 
    GetAllAppointmentsControl, 
    UpdateAppointmentControl 
} from "../controllers/appointment.controller.js";

const routes = Router();

routes.get("/", GetAllAppointmentsControl, Messages);
routes.post("/", CreateAppointmentControl, Messages);
routes.put("/:id", UpdateAppointmentControl, Messages);
routes.delete("/:id", DeleteAppointmentControl, Messages);

export default routes;