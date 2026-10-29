import api from '../api/axios';

export const useApi = (endpoint) => {
  // Obtener todos o por ID
  const get = async (id = '') => {
    try {
      const url = id ? `${endpoint}/${id}` : endpoint;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener ${endpoint}:`, error);
      throw error;
    }
  };

  // Crear nuevo registro
  const create = async (data) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error al crear en ${endpoint}:`, error);
      throw error;
    }
  };

  // Actualizar registro existente
  const update = async (id, data) => {
    try {
      const response = await api.put(`${endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar en ${endpoint}:`, error);
      throw error;
    }
  };

  // Eliminar registro
  const remove = async (id) => {
    try {
      const response = await api.delete(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar en ${endpoint}:`, error);
      throw error;
    }
  };

  return { get, create, update, remove };
};
