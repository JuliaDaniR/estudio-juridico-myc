import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

// 1. Iniciar sesión (Login)
export const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios.' });
  }

  try {
    const [usuarios] = await pool.query(
      'SELECT Id, Email, Password, Rol, NombreCompleto FROM Usuarios WHERE Email = ?',
      [email.trim()]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas (usuario no encontrado).' });
    }

    const usuario = usuarios[0];

    // Comparar contraseña ingresada con el hash encriptado
    const passwordValida = await bcrypt.compare(password, usuario.Password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas (contraseña incorrecta).' });
    }

    // Generar Token JWT firmado (duración: 4 horas)
    const secretKey =
      process.env.CLAVE_SECRETA_JWT ||
      process.env.JWT_SECRET_MYC ||
      process.env.JWT_SECRET ||
      'EstudioJuridicoMYC_SecretKey_2026';
    const tokenAcceso = jwt.sign(
      { id: usuario.Id, rol: usuario.Rol, email: usuario.Email },
      secretKey,
      { expiresIn: '4h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso.',
      tokenAcceso,
      usuario: {
        id: usuario.Id,
        email: usuario.Email,
        rol: usuario.Rol,
        nombreCompleto: usuario.NombreCompleto
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor al iniciar sesión.' });
  }
};

// 2. Registrar nuevo usuario (opcional)
export const registrarUsuario = async (req, res) => {
  const { email, password, rol, nombreCompleto } = req.body;

  if (!email || !password || !nombreCompleto) {
    return res.status(400).json({ mensaje: 'Email, contraseña y Nombre Completo son obligatorios.' });
  }

  try {
    const [existente] = await pool.query('SELECT Id FROM Usuarios WHERE Email = ?', [email]);
    if (existente.length > 0) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' });
    }

    const salt = 10;
    const passwordHash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO Usuarios (Email, Password, Rol, NombreCompleto) VALUES (?, ?, ?, ?)',
      [email.trim(), passwordHash, rol || 'abogado', nombreCompleto.trim()]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente.',
      idUsuario: result.insertId
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno al registrar usuario.' });
  }
};
