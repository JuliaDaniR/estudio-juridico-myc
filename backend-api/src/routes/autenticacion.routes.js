import { Router } from 'express';
import { iniciarSesion, registrarUsuario } from '../controller/autenticacion.controller.js';

const router = Router();

router.post('/login', iniciarSesion);
router.post('/registro', registrarUsuario);

export default router;
