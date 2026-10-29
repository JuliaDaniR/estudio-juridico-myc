import { Router } from 'express';
import {
  getJuzgados,
  getJuzgadoById,
  createJuzgado,
  updateJuzgado,
  deleteJuzgado,
  reactivarJuzgado
} from '../controller/juzgado.controller.js';
import { verificarTokenAcceso } from '../middleware/autenticar.middleware.js';

const router = Router();

// Rutas protegidas mediante JWT
router.get('/', getJuzgados);
router.get('/:id', verificarTokenAcceso, getJuzgadoById);
router.post('/', verificarTokenAcceso, createJuzgado);
router.put('/:id', verificarTokenAcceso, updateJuzgado);
router.delete('/:id', verificarTokenAcceso, deleteJuzgado);
router.patch('/:id/reactivar', verificarTokenAcceso, reactivarJuzgado);

export default router;
