import { Router } from "express";
import Messages from "../messages.js";
import { 
    GetAppointmentsControl, 
    CreateAppointmentControl, 
    UpdateAppointmentControl, 
    DeleteAppointmentControl 
} from "../controllers/appointment.controller.js";

const routes = Router();

routes.get("/", GetAppointmentsControl, Messages);
routes.post("/", CreateAppointmentControl, Messages);
routes.put("/:id", UpdateAppointmentControl, Messages);
routes.delete("/:id", DeleteAppointmentControl, Messages);

export default routes;