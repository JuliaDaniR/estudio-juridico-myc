import { useContext } from 'react';
import { AutenticacionContext } from '../context/AutenticacionContexto';

export const useAutenticacion = () => {
  const contexto = useContext(AutenticacionContext);
  if (!contexto) {
    throw new Error('useAutenticacion debe usarse dentro de un AutenticacionProvider');
  }
  return contexto;
};

export default useAutenticacion;
