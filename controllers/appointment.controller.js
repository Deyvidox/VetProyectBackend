import { appointmentSchema, AppointmentIdValidated } from "../validates/appointment.validation.js";
import { GetAllAppointments, CreateAppointment, UpdateAppointment, DeleteAppointment } from "../modules/appointment.model.js";

export const GetAppointmentsControl = async (req, res, next) => {
    try {
        const { search } = req.query;
        const { results, data } = await GetAllAppointments(search);
        req.message = {
            type: "Successfully",
            message: { context: "Citas recuperadas", count: results, appointments: data },
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
        const val = appointmentSchema.safeParse(req.body);
        if (!val.success) {
            req.message = { type: "Validation", message: val.error.errors.map(e => e.message).join(", "), status: 400 };
            return next();
        }
        const { pet_id, status, notes } = val.data;
        const { data } = await CreateAppointment(pet_id, status, notes);
        req.message = { type: "Successfully", message: { context: "Cita agendada", data }, status: 201 };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};

export const UpdateAppointmentControl = async (req, res, next) => {
    try {
        const idVal = AppointmentIdValidated.safeParse({ id: req.params.id });
        const dataVal = appointmentSchema.safeParse(req.body);
        if (!idVal.success || !dataVal.success) {
            req.message = { type: "Validation", message: "ID o datos inválidos", status: 400 };
            return next();
        }
        const { results, data } = await UpdateAppointment(req.params.id, dataVal.data.status, dataVal.data.notes);
        if (results === 0) {
            req.message = { type: "Error", message: "Cita no encontrada", status: 404 };
            return next();
        }
        req.message = { type: "Successfully", message: { context: "Cita actualizada", data }, status: 200 };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};

export const DeleteAppointmentControl = async (req, res, next) => {
    try {
        const { results } = await DeleteAppointment(req.params.id);
        req.message = results > 0 
            ? { type: "Successfully", message: "Cita eliminada", status: 200 }
            : { type: "Error", message: "Cita no encontrada", status: 404 };
        return next();
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 };
        return next();
    }
};