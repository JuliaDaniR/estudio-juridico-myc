import pool from './src/db.js';

async function migrar() {
  try {
    const [jCols] = await pool.query("SHOW COLUMNS FROM juzgado LIKE 'Activo'");
    if (jCols.length === 0) {
      await pool.query("ALTER TABLE juzgado ADD COLUMN Activo tinyint(1) NOT NULL DEFAULT 1");
      console.log('✅ Columna Activo agregada a la tabla juzgado');
    } else {
      console.log('ℹ️ Columna Activo ya existe en juzgado');
    }

    const [dCols] = await pool.query("SHOW COLUMNS FROM documentos LIKE 'Activo'");
    if (dCols.length === 0) {
      await pool.query("ALTER TABLE documentos ADD COLUMN Activo tinyint(1) NOT NULL DEFAULT 1");
      console.log('✅ Columna Activo agregada a la tabla documentos');
    } else {
      console.log('ℹ️ Columna Activo ya existe en documentos');
    }
  } catch (err) {
    console.error('Error en migración:', err);
  } finally {
    process.exit(0);
  }
}

migrar();
