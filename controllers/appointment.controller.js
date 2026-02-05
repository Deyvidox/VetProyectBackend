
import { AppointmentSchemaValidated, AppointmentIdValidated } from "../validates/appointment.validate.js";
import { CreateAppointment, DeleteAppointment, GetAllAppointments, UpdateAppointment } from "../modules/appointment.model.js";

export const GetAllAppointmentsControl = async (req, res, next) => {
    try {
        const { results, data } = await GetAllAppointments();
        req.message = {
            type: "Successfully",
            message: { context: "Citas obtenidas con éxito", count: results, appointments: data },
            status: 200
        };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};

export const CreateAppointmentControl = async (req, res, next) => {
    try {
        const validation = AppointmentSchemaValidated.safeParse(req.body);
        if (!validation.success) {
            req.message = { 
                type: "Validation", 
                message: validation.error.errors.map(e => e.message).join(", "), 
                status: 400 
            };
            return next();
        }

        const { results, data } = await CreateAppointment(
            validation.data.mascota_id, validation.data.veterinario_id, 
            validation.data.fecha_cita, validation.data.estado, validation.data.notas
        );

        req.message = {
            type: "Successfully",
            message: { context: "Cita programada correctamente", count: results, data: data },
            status: 201
        };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};

export const UpdateAppointmentControl = async (req, res, next) => {
    try {
        const validation = AppointmentSchemaValidated.safeParse(req.body);
        const idValidation = AppointmentIdValidated.safeParse({ id: req.params.id });

        if (!validation.success || !idValidation.success) {
            req.message = { 
                type: "Validation", 
                message: "Datos de cita o ID inválidos", 
                status: 400 
            };
            return next();
        }

        const { results, data } = await UpdateAppointment(
            req.params.id, validation.data.mascota_id, validation.data.veterinario_id, 
            validation.data.fecha_cita, validation.data.estado, validation.data.notas
        );

        req.message = {
            type: "Successfully",
            message: { context: "Cita actualizada", count: results, data: data },
            status: 200
        };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};

export const DeleteAppointmentControl = async (req, res, next) => {
    try {
        const { results } = await DeleteAppointment(req.params.id);
        if (results === 0) {
            req.message = { type: "Error", message: "Cita no encontrada", status: 404 };
            return next();
        }
        req.message = { type: "Successfully", message: "Cita eliminada satisfactoriamente", status: 200 };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};