import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST_MYC || 'localhost',
  user: process.env.DB_USER_MYC || 'root',
  password: process.env.DB_PASSWORD_MYC || '',
  database: process.env.DB_NAME_MYC || 'MYC',
  port: Number(process.env.DB_PORT_MYC) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prueba inicial de conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a la base de datos MYC');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos MYC:', error.message);
  }
}

testConnection();

export { pool };
export default pool;
