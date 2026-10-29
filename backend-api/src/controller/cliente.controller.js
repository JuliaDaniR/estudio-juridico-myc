import pool from '../db.js';

// 1. Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT Id, TipoPersona, TipoDni, ApellidoRsocial, Nombres, Domicilio, 
              Telefono, Email, Localidad, Cpostal, 
              DATE_FORMAT(Fnacimiento, '%Y-%m-%d') AS Fnacimiento, 
              DATE_FORMAT(Falta, '%Y-%m-%d') AS Falta, 
              DATE_FORMAT(Fbaja, '%Y-%m-%d') AS Fbaja 
       FROM Clientes 
       ORDER BY ApellidoRsocial ASC, Nombres ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener clientes:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al consultar clientes.' });
  }
};

// 2. Obtener un cliente por su ID
export const getClienteById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT Id, TipoPersona, TipoDni, ApellidoRsocial, Nombres, Domicilio, 
              Telefono, Email, Localidad, Cpostal, 
              DATE_FORMAT(Fnacimiento, '%Y-%m-%d') AS Fnacimiento, 
              DATE_FORMAT(Falta, '%Y-%m-%d') AS Falta, 
              DATE_FORMAT(Fbaja, '%Y-%m-%d') AS Fbaja 
       FROM Clientes WHERE Id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener cliente por ID:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al buscar el cliente.' });
  }
};

// 3. Crear un nuevo cliente (Alta)
export const createCliente = async (req, res) => {
  const {
    TipoPersona,
    TipoDni,
    ApellidoRsocial,
    Nombres,
    Domicilio,
    Telefono,
    Email,
    Localidad,
    Cpostal,
    Fnacimiento,
    Falta
  } = req.body;

  // Validaciones básicas de campos obligatorios
  if (!TipoDni || !ApellidoRsocial || !Nombres || !Telefono) {
    return res.status(400).json({
      message: 'Los campos DNI/CUIT, Apellido/Razón Social, Nombres y Teléfono son obligatorios.'
    });
  }

  // Si no se envía fecha de alta, asignamos la fecha actual (YYYY-MM-DD)
  const fechaAlta = Falta || new Date().toISOString().split('T')[0];
  const fechaNac = Fnacimiento || null;

  try {
    const [result] = await pool.query(
      `INSERT INTO Clientes 
        (TipoPersona, TipoDni, ApellidoRsocial, Nombres, Domicilio, Telefono, Email, Localidad, Cpostal, Fnacimiento, Falta) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        TipoPersona || 1,
        TipoDni,
        ApellidoRsocial,
        Nombres,
        Domicilio || '',
        Telefono,
        Email || '',
        Localidad || '',
        Cpostal || '',
        fechaNac,
        fechaAlta
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Cliente registrado exitosamente.'
    });
  } catch (error) {
    console.error('Error al crear cliente:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al crear el cliente.' });
  }
};

// 4. Modificar un cliente (Edición)
export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const {
    TipoPersona,
    TipoDni,
    ApellidoRsocial,
    Nombres,
    Domicilio,
    Telefono,
    Email,
    Localidad,
    Cpostal,
    Fnacimiento,
    Falta,
    Fbaja
  } = req.body;

  if (!TipoDni || !ApellidoRsocial || !Nombres || !Telefono) {
    return res.status(400).json({
      message: 'Los campos DNI/CUIT, Apellido/Razón Social, Nombres y Teléfono son obligatorios.'
    });
  }

  try {
    const [result] = await pool.query(
      `UPDATE Clientes SET 
        TipoPersona = ?, 
        TipoDni = ?, 
        ApellidoRsocial = ?, 
        Nombres = ?, 
        Domicilio = ?, 
        Telefono = ?, 
        Email = ?, 
        Localidad = ?, 
        Cpostal = ?, 
        Fnacimiento = ?, 
        Falta = ?, 
        Fbaja = ? 
       WHERE Id = ?`,
      [
        TipoPersona || 1,
        TipoDni,
        ApellidoRsocial,
        Nombres,
        Domicilio || '',
        Telefono,
        Email || '',
        Localidad || '',
        Cpostal || '',
        Fnacimiento || null,
        Falta,
        Fbaja || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado para actualizar.' });
    }

    res.json({ message: 'Cliente actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar cliente:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al actualizar cliente.' });
  }
};

// 5. Eliminar o Inactivar un cliente (Baja Lógica / Trazabilidad vs Definitivo)
export const deleteCliente = async (req, res) => {
  const { id } = req.params;
  const tipo = req.query.tipo || 'soft'; // 'soft' (por defecto) o 'definitivo'

  try {
    if (tipo === 'definitivo') {
      // Regla de integridad referencial: validar si el cliente tiene expedientes
      const [expedientes] = await pool.query(
        'SELECT idExpediente FROM Cliente_Expediente WHERE idCliente = ?',
        [id]
      );

      if (expedientes.length > 0) {
        return res.status(400).json({
          message: 'No es posible la eliminación definitiva porque el cliente posee causas judiciales vinculadas. Se recomienda dar de baja lógica para preservar la trazabilidad.'
        });
      }

      const [result] = await pool.query('DELETE FROM Clientes WHERE Id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado.' });
      }
      return res.json({ message: 'Cliente eliminado definitivamente de la base de datos.' });
    }

    // Baja Lógica (Soft Delete / Inactivar): Preserva trazabilidad legal
    const [result] = await pool.query(
      'UPDATE Clientes SET Fbaja = CURDATE() WHERE Id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    res.json({ message: 'Cliente dado de baja lógicamente (inactivo). Se preserva el historial de sus causas.' });
  } catch (error) {
    console.error('Error al dar de baja cliente:', error.message);
    res.status(500).json({ message: 'Error interno del servidor al procesar la baja del cliente.' });
  }
};

// 6. Reactivar un cliente dado de baja
export const reactivarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('UPDATE Clientes SET Fbaja = NULL WHERE Id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }
    res.json({ message: 'Cliente reactivado exitosamente.' });
  } catch (error) {
    console.error('Error al reactivar cliente:', error.message);
    res.status(500).json({ message: 'Error interno al reactivar el cliente.' });
  }
};
