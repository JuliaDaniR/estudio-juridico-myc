import { Router } from 'express';
import {
  getDocumentosPorExpediente,
  crearDocumento,
  eliminarDocumento,
  reactivarDocumento
} from '../controller/documento.controller.js';
import { verificarTokenAcceso } from '../middleware/autenticar.middleware.js';

const router = Router();

// Endpoints para documentos
router.get('/expediente/:idExpediente', getDocumentosPorExpediente);
router.post('/expediente/:idExpediente', verificarTokenAcceso, crearDocumento);
router.delete('/:id', verificarTokenAcceso, eliminarDocumento);
router.patch('/:id/reactivar', verificarTokenAcceso, reactivarDocumento);

export default router;
