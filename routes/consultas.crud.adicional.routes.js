import { Router } from 'express';
// Salimos de routes con ../ y entramos a las carpetas correspondientes
import * as ConsultasController from '../controllers/consultas.crud.adicional.controllers.js';
import { validarConsultaId } from '../validates/consultas.crud.adicional.validates.js';
import Messages from '../messages.js';

const router = Router();

router.get('/listar',
    validarConsultaId,
    ConsultasController.listarConsultasAdicional,
    Messages
);

export default router;