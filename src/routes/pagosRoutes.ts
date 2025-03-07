import { Router } from 'express';
import { definirPago, registrarPago, obtenerEstadoPago } from '../controllers/pagosController';

const router = Router();

// Definir plan de pago del usuario
router.post('/definir', definirPago);

// Registrar un pago
router.post('/registrar', registrarPago);

// Consultar estado del pago
router.get('/estado/:usuario', obtenerEstadoPago);

export default router;
