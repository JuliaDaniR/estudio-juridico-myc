import { useState, useEffect } from 'react';
import { EstudioContext } from './EstudioContext';
import { useApi } from '../hooks/useApi';
import api from '../api/axios';
import { useToast } from './ToastContext';

export const EstudioProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [juzgados, setJuzgados] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { mostrarToast } = useToast();

  const clientesApi = useApi('/clientes');
  const juzgadosApi = useApi('/juzgados');
  const expedientesApi = useApi('/expedientes');

  // Carga inicial simultánea de Clientes, Juzgados y Expedientes
  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [resClientes, resJuzgados, resExpedientes] = await Promise.all([
        clientesApi.get(),
        juzgadosApi.get(),
        expedientesApi.get()
      ]);
      setClientes(resClientes);
      setJuzgados(resJuzgados);
      setExpedientes(resExpedientes);
      setError(null);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudo conectar con el servidor.');
      mostrarToast('Error al conectar con la base de datos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ==========================================
  // CLIENTES
  // ==========================================
  const cargarClientes = async () => {
    try {
      const data = await clientesApi.get();
      setClientes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const agregarCliente = async (nuevo) => {
    try {
      await clientesApi.create(nuevo);
      await cargarClientes();
      mostrarToast('Cliente registrado exitosamente en el padrón.', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar el cliente';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const actualizarCliente = async (id, datos) => {
    try {
      await clientesApi.update(id, datos);
      await cargarClientes();
      mostrarToast('Datos del cliente actualizados correctamente.', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar el cliente';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const eliminarCliente = async (id, tipo = 'soft') => {
    try {
      const res = await api.delete(`/clientes/${id}?tipo=${tipo}`);
      await cargarClientes();
      mostrarToast(res.data?.message || (tipo === 'soft' ? 'Cliente dado de baja lógicamente.' : 'Cliente eliminado definitivamente.'), 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al procesar la baja del cliente';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const reactivarCliente = async (id) => {
    try {
      const res = await api.patch(`/clientes/${id}/reactivar`);
      await cargarClientes();
      mostrarToast(res.data?.message || 'Cliente reactivado como Activo.', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al reactivar el cliente';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // ==========================================
  // JUZGADOS
  // ==========================================
  const cargarJuzgados = async () => {
    try {
      const data = await juzgadosApi.get();
      setJuzgados(data);
    } catch (err) {
      console.error(err);
    }
  };

  const agregarJuzgado = async (nuevo) => {
    try {
      await juzgadosApi.create(nuevo);
      await cargarJuzgados();
      mostrarToast('Juzgado registrado exitosamente.', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar el juzgado';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const actualizarJuzgado = async (id, datos) => {
    try {
      await juzgadosApi.update(id, datos);
      await cargarJuzgados();
      mostrarToast('Juzgado actualizado correctamente.', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar el juzgado';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const eliminarJuzgado = async (id, tipo = 'soft') => {
    try {
      const res = await api.delete(`/juzgados/${id}?tipo=${tipo}`);
      await cargarJuzgados();
      mostrarToast(res.data?.message || (tipo === 'soft' ? 'Juzgado inactivado lógicamente.' : 'Juzgado eliminado definitivamente.'), 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al procesar baja del juzgado';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const reactivarJuzgado = async (id) => {
    try {
      const res = await api.patch(`/juzgados/${id}/reactivar`);
      await cargarJuzgados();
      mostrarToast(res.data?.message || 'Juzgado reactivado como Activo.', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al reactivar el juzgado';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // ==========================================
  // EXPEDIENTES
  // ==========================================
  const cargarExpedientes = async () => {
    try {
      const data = await expedientesApi.get();
      setExpedientes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const agregarExpediente = async (nuevo) => {
    try {
      await expedientesApi.create(nuevo);
      await cargarExpedientes();
      mostrarToast('Causa/Expediente registrado exitosamente.', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrar el expediente';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const actualizarExpediente = async (id, datos) => {
    try {
      await expedientesApi.update(id, datos);
      await cargarExpedientes();
      mostrarToast('Causa actualizada correctamente.', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar el expediente';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const eliminarExpediente = async (id, tipo = 'soft') => {
    try {
      const res = await api.delete(`/expedientes/${id}?tipo=${tipo}`);
      await cargarExpedientes();
      mostrarToast(res.data?.message || (tipo === 'soft' ? 'Expediente archivado e inactivado.' : 'Expediente eliminado definitivamente.'), 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al procesar la baja del expediente';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const reactivarExpediente = async (id) => {
    try {
      const res = await api.patch(`/expedientes/${id}/reactivar`);
      await cargarExpedientes();
      mostrarToast(res.data?.message || 'Expediente reactivado como Activo.', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al reactivar expediente';
      mostrarToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  return (
    <EstudioContext.Provider
      value={{
        clientes,
        juzgados,
        expedientes,
        isLoading,
        error,
        cargarClientes,
        agregarCliente,
        actualizarCliente,
        eliminarCliente,
        reactivarCliente,
        cargarJuzgados,
        agregarJuzgado,
        actualizarJuzgado,
        eliminarJuzgado,
        reactivarJuzgado,
        cargarExpedientes,
        agregarExpediente,
        actualizarExpediente,
        eliminarExpediente,
        reactivarExpediente
      }}
    >
      {children}
    </EstudioContext.Provider>
  );
};

export default EstudioProvider;
