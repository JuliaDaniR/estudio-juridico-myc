import { Router } from 'express';
import {
  getExpedientes,
  getExpedienteById,
  createExpediente,
  updateExpediente,
  deleteExpediente,
  reactivarExpediente,
  vincularCliente
} from '../controller/expediente.controller.js';
import { verificarTokenAcceso } from '../middleware/autenticar.middleware.js';

const router = Router();

// Rutas protegidas mediante JWT
router.get('/', getExpedientes);
router.get('/:id', verificarTokenAcceso, getExpedienteById);
router.post('/', verificarTokenAcceso, createExpediente);
router.put('/:id', verificarTokenAcceso, updateExpediente);
router.delete('/:id', verificarTokenAcceso, deleteExpediente);
router.patch('/:id/reactivar', verificarTokenAcceso, reactivarExpediente);
router.post('/:id/clientes', verificarTokenAcceso, vincularCliente);

export default router;
