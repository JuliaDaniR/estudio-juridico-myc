import bcrypt from 'bcryptjs';
import pool from './src/db.js';

const email = process.argv[2] || 'admin@estudiomyc.com';
const password = process.argv[3] || 'admin123';
const nombreCompleto = process.argv[4] || 'Dra. María Belén Méndez';
const rol = 'abogado';

async function crearUsuarioInicial() {
  try {
    const [existentes] = await pool.query('SELECT Id FROM Usuarios WHERE Email = ?', [email]);

    if (existentes.length > 0) {
      console.log(`ℹ️ El usuario ${email} ya existe en la base de datos.`);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [resultado] = await pool.query(
      'INSERT INTO Usuarios (Email, Password, Rol, NombreCompleto) VALUES (?, ?, ?, ?)',
      [email, passwordHash, rol, nombreCompleto]
    );

    console.log('✅ ¡Usuario creado exitosamente!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Contraseña: ${password}`);
    console.log(`👤 Nombre: ${nombreCompleto}`);
    console.log(`🆔 ID en BD: ${resultado.insertId}`);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
  } finally {
    process.exit(0);
  }
}

crearUsuarioInicial();
