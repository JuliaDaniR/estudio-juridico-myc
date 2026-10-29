import jwt from 'jsonwebtoken';

/**
 * Middleware para validar el JSON Web Token (JWT) en rutas protegidas.
 */
export const verificarTokenAcceso = (req, res, siguientePaso) => {
  // El token se envía en la cabecera HTTP: Authorization: Bearer <TOKEN>
  const cabeceraAutorizacion = req.headers['authorization'];
  const tokenExtraido = cabeceraAutorizacion && cabeceraAutorizacion.split(' ')[1];

  if (!tokenExtraido) {
    return res.status(401).json({
      mensaje: 'Acceso denegado. Se requiere inicio de sesión (Token no proporcionado).'
    });
  }

  const claveSecreta =
    process.env.JWT_SECRET_MYC ||
    'EstudioJuridicoMYC_SecretKey_2026';

  try {
    // Validar la autenticidad y vigencia del token con la clave secreta
    const datosDecodificados = jwt.verify(tokenExtraido, claveSecreta);

    // Adjuntar la información del usuario autenticado (email, rol, id) a la petición
    req.usuarioAutenticado = datosDecodificados;

    // Permitir avanzar al controlador final
    siguientePaso();
  } catch (error) {
    console.error('Error de verificación JWT en middleware:', error.message);
    return res.status(403).json({
      mensaje: 'Acceso denegado. Sesión inválida o expirada.'
    });
  }
};

export default verificarTokenAcceso;
