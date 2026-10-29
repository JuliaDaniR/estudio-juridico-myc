import pool from '../db.js';

// Obtener todos los documentos asociados a un expediente
export const getDocumentosPorExpediente = async (req, res) => {
  try {
    const { idExpediente } = req.params;
    const [rows] = await pool.query(
      `SELECT 
        Id, 
        idExpediente, 
        Nombre, 
        Categoria, 
        Tamano, 
        DATE_FORMAT(Fecha, '%Y-%m-%d') AS Fecha, 
        Autor, 
        Resumen, 
        TipoMime, 
        ArchivoContenido, 
        Activo,
        CreatedAt 
       FROM documentos 
       WHERE idExpediente = ? 
       ORDER BY Id DESC`,
      [idExpediente]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error al consultar documentos del expediente:', error.message);
    res.status(500).json({ message: 'Error interno al obtener documentos del expediente.' });
  }
};

// Guardar y adjuntar un nuevo documento a un expediente
export const crearDocumento = async (req, res) => {
  try {
    const { idExpediente } = req.params;
    const { Nombre, Categoria, Tamano, Fecha, Autor, Resumen, TipoMime, ArchivoContenido } = req.body;

    if (!Nombre || !Categoria) {
      return res.status(400).json({ message: 'El nombre y la categoría del documento son obligatorios.' });
    }

    const fechaFinal = Fecha || new Date().toISOString().split('T')[0];
    const autorFinal = Autor || 'Dra. María Belén Méndez';
    const tamanoFinal = Tamano || '1.0 MB';
    const tipoMimeFinal = TipoMime || 'application/pdf';

    const [resultado] = await pool.query(
      `INSERT INTO documentos (idExpediente, Nombre, Categoria, Tamano, Fecha, Autor, Resumen, TipoMime, ArchivoContenido, Activo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        idExpediente,
        Nombre.trim(),
        Categoria.trim(),
        tamanoFinal,
        fechaFinal,
        autorFinal,
        Resumen?.trim() || null,
        tipoMimeFinal,
        ArchivoContenido || null
      ]
    );

    const [nuevoDoc] = await pool.query(
      `SELECT 
        Id, 
        idExpediente, 
        Nombre, 
        Categoria, 
        Tamano, 
        DATE_FORMAT(Fecha, '%Y-%m-%d') AS Fecha, 
        Autor, 
        Resumen, 
        TipoMime, 
        ArchivoContenido, 
        Activo,
        CreatedAt 
       FROM documentos 
       WHERE Id = ?`,
      [resultado.insertId]
    );

    res.status(201).json({
      message: 'Documento adjuntado exitosamente al expediente.',
      documento: nuevoDoc[0]
    });
  } catch (error) {
    console.error('Error al crear documento:', error.message);
    res.status(500).json({ message: 'Error interno al adjuntar documento.' });
  }
};

// Eliminar o Inactivar un documento (Baja Lógica vs Definitivo)
export const eliminarDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = req.query.tipo || 'soft';

    if (tipo === 'definitivo') {
      const [resultado] = await pool.query('DELETE FROM documentos WHERE Id = ?', [id]);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'El documento no existe o ya fue eliminado.' });
      }
      return res.json({ message: 'Documento eliminado definitivamente de la base de datos.' });
    }

    // Baja Lógica: Pasa a inactivo
    const [resultado] = await pool.query('UPDATE documentos SET Activo = 0 WHERE Id = ?', [id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'El documento no existe o ya fue eliminado.' });
    }

    res.json({ message: 'Documento archivado e inactivado lógicamente.' });
  } catch (error) {
    console.error('Error al dar de baja documento:', error.message);
    res.status(500).json({ message: 'Error interno al procesar la baja del documento.' });
  }
};

// Reactivar un documento inactivado
export const reactivarDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const [resultado] = await pool.query('UPDATE documentos SET Activo = 1 WHERE Id = ?', [id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'El documento no existe o ya fue reactivado.' });
    }
    res.json({ message: 'Documento reactivado exitosamente.' });
  } catch (error) {
    console.error('Error al reactivar documento:', error.message);
    res.status(500).json({ message: 'Error interno al reactivar documento.' });
  }
};
