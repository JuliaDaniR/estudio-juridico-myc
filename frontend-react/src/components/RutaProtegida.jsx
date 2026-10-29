import { Navigate, Outlet } from 'react-router-dom';
import { useAutenticacion } from '../hooks/useAutenticacion';

export const RutaProtegida = () => {
  const { usuarioActual } = useAutenticacion();

  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RutaProtegida;
