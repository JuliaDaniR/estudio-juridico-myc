import pool from '../db.js';

// 1. Obtener todos los juzgados
export const getJuzgados = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT Id, NroJuzgado, NombreJuzgado, Jueztram, Secretario, Telefono, Activo FROM Juzgado ORDER BY NroJuzgado ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener juzgados:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al consultar juzgados.' });
  }
};

// 2. Obtener un juzgado por ID
export const getJuzgadoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT Id, NroJuzgado, NombreJuzgado, Jueztram, Secretario, Telefono FROM Juzgado WHERE Id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Juzgado no encontrado.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener juzgado por ID:', error.message);
    res.status(500).json({ message: 'Error interno al buscar el juzgado.' });
  }
};

// 3. Crear un nuevo juzgado (Alta)
export const createJuzgado = async (req, res) => {
  const { NroJuzgado, NombreJuzgado, Jueztram, Secretario, Telefono } = req.body;

  if (!NroJuzgado || !NombreJuzgado) {
    return res.status(400).json({
      message: 'El Número de Juzgado y el Nombre del Juzgado son obligatorios.'
    });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO Juzgado (NroJuzgado, NombreJuzgado, Jueztram, Secretario, Telefono) VALUES (?, ?, ?, ?, ?)',
      [
        NroJuzgado.trim(),
        NombreJuzgado.trim(),
        Jueztram ? Jueztram.trim() : '',
        Secretario ? Secretario.trim() : '',
        Telefono ? Telefono.trim() : ''
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Juzgado registrado exitosamente.'
    });
  } catch (error) {
    console.error('Error al registrar juzgado:', error.message);
    res.status(500).json({ message: 'Error interno al registrar juzgado.' });
  }
};

// 4. Modificar un juzgado (Edición)
export const updateJuzgado = async (req, res) => {
  const { id } = req.params;
  const { NroJuzgado, NombreJuzgado, Jueztram, Secretario, Telefono } = req.body;

  if (!NroJuzgado || !NombreJuzgado) {
    return res.status(400).json({
      message: 'El Número de Juzgado y el Nombre del Juzgado son obligatorios.'
    });
  }

  try {
    const [result] = await pool.query(
      'UPDATE Juzgado SET NroJuzgado = ?, NombreJuzgado = ?, Jueztram = ?, Secretario = ?, Telefono = ? WHERE Id = ?',
      [
        NroJuzgado.trim(),
        NombreJuzgado.trim(),
        Jueztram ? Jueztram.trim() : '',
        Secretario ? Secretario.trim() : '',
        Telefono ? Telefono.trim() : '',
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Juzgado no encontrado para actualizar.' });
    }

    res.json({ message: 'Juzgado actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar juzgado:', error.message);
    res.status(500).json({ message: 'Error interno al actualizar el juzgado.' });
  }
};

// 5. Eliminar o Inactivar un juzgado (Baja Lógica vs Definitivo)
export const deleteJuzgado = async (req, res) => {
  const { id } = req.params;
  const tipo = req.query.tipo || 'soft';

  try {
    if (tipo === 'definitivo') {
      // Regla de integridad: comprobar si existen expedientes asignados a este juzgado
      const [expedientes] = await pool.query(
        'SELECT Id FROM Expedientes WHERE Juzgado = ?',
        [id]
      );

      if (expedientes.length > 0) {
        return res.status(400).json({
          message: 'No es posible la eliminación definitiva del juzgado porque posee expedientes judiciales radicados. Se recomienda la baja lógica para mantener la trazabilidad.'
        });
      }

      const [result] = await pool.query('DELETE FROM Juzgado WHERE Id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Juzgado no encontrado.' });
      }
      return res.json({ message: 'Juzgado eliminado definitivamente de la base de datos.' });
    }

    // Baja Lógica: Pasa a inactivo
    const [result] = await pool.query('UPDATE Juzgado SET Activo = 0 WHERE Id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Juzgado no encontrado.' });
    }
    res.json({ message: 'Juzgado inactivado lógicamente. Se conserva la trazabilidad de sus causas radicadas.' });
  } catch (error) {
    console.error('Error al procesar baja de juzgado:', error.message);
    res.status(500).json({ message: 'Error interno al procesar la baja del juzgado.' });
  }
};

// Reactivar un juzgado inactivado
export const reactivarJuzgado = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('UPDATE Juzgado SET Activo = 1 WHERE Id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Juzgado no encontrado.' });
    }
    res.json({ message: 'Juzgado reactivado como Activo exitosamente.' });
  } catch (error) {
    console.error('Error al reactivar juzgado:', error.message);
    res.status(500).json({ message: 'Error interno al reactivar el juzgado.' });
  }
};
