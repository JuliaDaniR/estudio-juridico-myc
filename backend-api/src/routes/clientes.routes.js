import { Router } from 'express';
import {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  reactivarCliente
} from '../controller/cliente.controller.js'; 
import { verificarTokenAcceso } from '../middleware/autenticar.middleware.js';

const router = Router();

// Rutas de clientes protegidas mediante JWT
router.get('/', getClientes);
router.get('/:id', verificarTokenAcceso, getClienteById);
router.post('/', verificarTokenAcceso, createCliente);
router.put('/:id', verificarTokenAcceso, updateCliente);
router.delete('/:id', verificarTokenAcceso, deleteCliente);
router.patch('/:id/reactivar', verificarTokenAcceso, reactivarCliente);

export default router;
