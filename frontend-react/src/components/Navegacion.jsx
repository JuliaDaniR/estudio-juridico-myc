import { NavLink } from 'react-router-dom';
import { useAutenticacion } from '../hooks/useAutenticacion';
import { Scale, Users, Briefcase, Landmark, LogOut, UserCircle } from 'lucide-react';

function Navegacion() {
  const { usuarioActual, cerrarSesion } = useAutenticacion();

  const getNavStyle = ({ isActive }) => ({
    color: isActive ? '#f59e0b' : '#94a3b8',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: '0.5rem 0.9rem',
    borderRadius: '8px',
    backgroundColor: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
  });

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Scale size={24} color="#f59e0b" strokeWidth={2.3} />
        <div>
          <span>M&C</span> Estudio Jurídico
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <NavLink to="/clientes" style={getNavStyle}>
          <Users size={18} />
          <span>Clientes</span>
        </NavLink>
        <NavLink to="/expedientes" style={getNavStyle}>
          <Briefcase size={18} />
          <span>Expedientes</span>
        </NavLink>
        <NavLink to="/juzgados" style={getNavStyle}>
          <Landmark size={18} />
          <span>Juzgados</span>
        </NavLink>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {usuarioActual && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserCircle size={20} />
            </div>
            <div style={{ fontSize: '0.82rem', textAlign: 'left' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                {usuarioActual.nombreCompleto || usuarioActual.email}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#f59e0b', textTransform: 'capitalize' }}>
                {usuarioActual.rol}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={cerrarSesion}
          className="btn btn-danger"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
          title="Cerrar Sesión"
        >
          <LogOut size={16} />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}

export default Navegacion;

