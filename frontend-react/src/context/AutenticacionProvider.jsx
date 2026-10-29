import { useState } from 'react';
import api from '../api/axios';
import { AutenticacionContext } from './AutenticacionContexto';

export const AutenticacionProvider = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState(() => {
    const token = localStorage.getItem('tokenAcceso');
    const datos = localStorage.getItem('datosUsuario');
    if (token && datos) {
      try {
        return JSON.parse(datos);
      } catch {
        return null;
      }
    }
    return null;
  });

  const iniciarSesion = async (email, password) => {
    try {
      const res = await api.post('/autenticacion/login', { email, password });
      const { tokenAcceso, usuario } = res.data;

      localStorage.setItem('tokenAcceso', tokenAcceso);
      localStorage.setItem('datosUsuario', JSON.stringify(usuario));
      setUsuarioActual(usuario);

      return { exito: true };
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al iniciar sesión.';
      return { exito: false, mensaje };
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('tokenAcceso');
    localStorage.removeItem('datosUsuario');
    setUsuarioActual(null);
  };

  return (
    <AutenticacionContext.Provider value={{ usuarioActual, iniciarSesion, cerrarSesion }}>
      {children}
    </AutenticacionContext.Provider>
  );
};

export default AutenticacionProvider;
