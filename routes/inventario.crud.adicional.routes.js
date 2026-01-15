import { Router } from 'express';
import * as InventarioCtrl from '../controllers/inventario.crud.adicional.controllers.js';
import { validarEntradaStock } from '../validates/inventario.crud.adicional.validates.js';

const router = Router();

// PUT para actualizar stock y precio
router.put('/entrada-proveedor', 
    validarEntradaStock, 
    InventarioCtrl.registrarEntradaProveedor
);

export default router;