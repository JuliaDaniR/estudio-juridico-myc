import pool from '../db.js';

// 1. Obtener todos los expedientes con su Juzgado y Clientes vinculados
export const getExpedientes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        e.Id, 
        e.TipoExpediente, 
        e.NroExpediente, 
        e.Juzgado AS idJuzgado,
        j.NombreJuzgado, 
        j.NroJuzgado,
        e.Caratura, 
        DATE_FORMAT(e.FechaInicio, '%Y-%m-%d') AS FechaInicio,
        e.TipoJuicio, 
        e.Acargode, 
        DATE_FORMAT(e.FechaFin, '%Y-%m-%d') AS FechaFin,
        e.Estado, 
        DATE_FORMAT(e.FechaBaja, '%Y-%m-%d') AS FechaBaja,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'idCliente', ce.idCliente,
              'Demandante', ce.Demandante,
              'ApellidoRsocial', c.ApellidoRsocial,
              'Nombres', c.Nombres,
              'TipoDni', c.TipoDni
            )
          )
          FROM Cliente_Expediente ce
          JOIN Clientes c ON ce.idCliente = c.Id
          WHERE ce.idExpediente = e.Id
        ) AS clientesVinculados
      FROM Expedientes e
      LEFT JOIN Juzgado j ON e.Juzgado = j.Id
      ORDER BY e.Id DESC`
    );

    // Normalizar el JSON de clientesVinculados
    const expedientes = rows.map((exp) => {
      let clientes = exp.clientesVinculados;
      if (typeof clientes === 'string') {
        try {
          clientes = JSON.parse(clientes);
        } catch {
          clientes = [];
        }
      }
      return {
        ...exp,
        clientesVinculados: clientes || []
      };
    });

    res.json(expedientes);
  } catch (error) {
    console.error('Error al obtener expedientes:', error.message);
    res.status(500).json({ message: 'Error interno al consultar expedientes.' });
  }
};

// 2. Obtener un expediente por ID
export const getExpedienteById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
        e.Id, e.TipoExpediente, e.NroExpediente, e.Juzgado AS idJuzgado,
        j.NombreJuzgado, j.NroJuzgado, e.Caratura,
        DATE_FORMAT(e.FechaInicio, '%Y-%m-%d') AS FechaInicio,
        e.TipoJuicio, e.Acargode,
        DATE_FORMAT(e.FechaFin, '%Y-%m-%d') AS FechaFin,
        e.Estado,
        DATE_FORMAT(e.FechaBaja, '%Y-%m-%d') AS FechaBaja
      FROM Expedientes e
      LEFT JOIN Juzgado j ON e.Juzgado = j.Id
      WHERE e.Id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Expediente no encontrado.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener expediente por ID:', error.message);
    res.status(500).json({ message: 'Error interno al buscar el expediente.' });
  }
};

// 3. Crear nuevo expediente y vincular cliente inicial (Alta)
export const createExpediente = async (req, res) => {
  const {
    TipoExpediente,
    NroExpediente,
    Juzgado,
    Caratura,
    FechaInicio,
    TipoJuicio,
    Acargode,
    Estado,
    idCliente,
    Demandante
  } = req.body;

  if (!NroExpediente || !Caratura || !TipoJuicio || !Acargode) {
    return res.status(400).json({
      message: 'Nro. de Expediente, Carátula, Tipo de Juicio y Abogado a Cargo son obligatorios.'
    });
  }

  const fechaIni = FechaInicio || new Date().toISOString().split('T')[0];

  try {
    // 1. Insertar el Expediente
    const [result] = await pool.query(
      `INSERT INTO Expedientes 
        (TipoExpediente, NroExpediente, Juzgado, Caratura, FechaInicio, TipoJuicio, Acargode, Estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        TipoExpediente || 'J',
        NroExpediente.trim(),
        Juzgado ? Number(Juzgado) : null,
        Caratura.trim(),
        fechaIni,
        TipoJuicio.trim(),
        Acargode.trim(),
        Estado || 'Activo'
      ]
    );

    const idNuevoExpediente = result.insertId;

    // 2. Si se seleccionó un cliente, vincularlo en Cliente_Expediente
    if (idCliente) {
      await pool.query(
        'INSERT INTO Cliente_Expediente (idCliente, idExpediente, Demandante) VALUES (?, ?, ?)',
        [Number(idCliente), idNuevoExpediente, Demandante || 'Demandante']
      );
    }

    res.status(201).json({
      id: idNuevoExpediente,
      message: 'Expediente registrado correctamente.'
    });
  } catch (error) {
    console.error('Error al registrar expediente:', error.message);
    res.status(500).json({ message: 'Error interno al registrar el expediente.' });
  }
};

// 4. Modificar un expediente (Edición)
export const updateExpediente = async (req, res) => {
  const { id } = req.params;
  const {
    TipoExpediente,
    NroExpediente,
    Juzgado,
    Caratura,
    FechaInicio,
    TipoJuicio,
    Acargode,
    FechaFin,
    Estado,
    FechaBaja
  } = req.body;

  if (!NroExpediente || !Caratura || !TipoJuicio || !Acargode) {
    return res.status(400).json({
      message: 'Nro. de Expediente, Carátula, Tipo de Juicio y Abogado a Cargo son obligatorios.'
    });
  }

  try {
    const [result] = await pool.query(
      `UPDATE Expedientes SET 
        TipoExpediente = ?, 
        NroExpediente = ?, 
        Juzgado = ?, 
        Caratura = ?, 
        FechaInicio = ?, 
        TipoJuicio = ?, 
        Acargode = ?, 
        FechaFin = ?, 
        Estado = ?, 
        FechaBaja = ? 
       WHERE Id = ?`,
      [
        TipoExpediente || 'J',
        NroExpediente.trim(),
        Juzgado ? Number(Juzgado) : null,
        Caratura.trim(),
        FechaInicio,
        TipoJuicio.trim(),
        Acargode.trim(),
        FechaFin || null,
        Estado || 'Activo',
        FechaBaja || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expediente no encontrado para actualizar.' });
    }

    res.json({ message: 'Expediente actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar expediente:', error.message);
    res.status(500).json({ message: 'Error interno al actualizar el expediente.' });
  }
};

// 5. Eliminar o Inactivar un expediente (Baja Lógica / Archivado vs Definitivo)
export const deleteExpediente = async (req, res) => {
  const { id } = req.params;
  const tipo = req.query.tipo || 'soft'; // 'soft' o 'definitivo'

  try {
    if (tipo === 'definitivo') {
      const [result] = await pool.query('DELETE FROM Expedientes WHERE Id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Expediente no encontrado.' });
      }
      return res.json({ message: 'Expediente eliminado definitivamente de la base de datos.' });
    }

    // Baja Lógica: Pasa a Archivado con FechaBaja para trazabilidad procesal
    const [result] = await pool.query(
      "UPDATE Expedientes SET FechaBaja = CURDATE(), Estado = 'Archivado' WHERE Id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expediente no encontrado.' });
    }

    res.json({ message: 'Expediente archivado e inactivado. Se conserva la trazabilidad procesal y sus documentos.' });
  } catch (error) {
    console.error('Error al dar de baja expediente:', error.message);
    res.status(500).json({ message: 'Error interno al procesar la baja del expediente.' });
  }
};

// Reactivar un expediente archivado
export const reactivarExpediente = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "UPDATE Expedientes SET FechaBaja = NULL, Estado = 'Activo' WHERE Id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expediente no encontrado.' });
    }
    res.json({ message: 'Expediente reactivado como Activo exitosamente.' });
  } catch (error) {
    console.error('Error al reactivar expediente:', error.message);
    res.status(500).json({ message: 'Error interno al reactivar el expediente.' });
  }
};

// 6. Vincular un nuevo cliente a un expediente existente
export const vincularCliente = async (req, res) => {
  const { id } = req.params;
  const { idCliente, Demandante } = req.body;

  if (!idCliente) {
    return res.status(400).json({ message: 'Debe especificar el cliente a vincular.' });
  }

  try {
    await pool.query(
      'INSERT INTO Cliente_Expediente (idCliente, idExpediente, Demandante) VALUES (?, ?, ?)',
      [Number(idCliente), Number(id), Demandante || 'Demandante']
    );
    res.status(201).json({ message: 'Cliente vinculado exitosamente al expediente.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'El cliente ya se encuentra vinculado a este expediente.' });
    }
    console.error('Error al vincular cliente:', error.message);
    res.status(500).json({ message: 'Error interno al vincular cliente.' });
  }
};
