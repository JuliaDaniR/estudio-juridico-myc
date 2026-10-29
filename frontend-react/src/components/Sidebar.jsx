import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Landmark, 
  Scale 
} from 'lucide-react';

function Sidebar() {
  const getNavStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    color: isActive ? '#E8D7A6' : '#B7AFC4',
    backgroundColor: isActive ? 'var(--color-eggplant)' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.92rem',
    transition: 'all 0.2s ease',
    border: isActive ? '1px solid rgba(232, 215, 166, 0.2)' : '1px solid transparent',
  });

  return (
    <aside className="app-sidebar">
      <div>
        {/* LOGO DE MARCA */}
        <div style={{ marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="brand-serif" style={{ fontSize: '1.8rem', color: '#E8D7A6', lineHeight: 1 }}>
              M&C
            </h1>
          </div>
          <div className="brand-serif" style={{ fontSize: '0.7rem', color: '#B7AFC4', letterSpacing: '0.18em', marginTop: '0.35rem' }}>
            ESTUDIO JURÍDICO
          </div>
          <div style={{ width: '40px', height: '2px', background: 'var(--accent-gold)', marginTop: '0.65rem', borderRadius: '2px' }} />
        </div>

        {/* MENÚ DE NAVEGACIÓN */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <NavLink to="/dashboard" style={getNavStyle}>
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/expedientes" style={getNavStyle}>
            <Briefcase size={19} />
            <span>Expedientes</span>
          </NavLink>

          <NavLink to="/clientes" style={getNavStyle}>
            <Users size={19} />
            <span>Clientes</span>
          </NavLink>

          <NavLink to="/juzgados" style={getNavStyle}>
            <Landmark size={19} />
            <span>Juzgados</span>
          </NavLink>
        </nav>
      </div>

      {/* TARJETA AL PIE*/}
      <div style={{
        background: 'rgba(38, 32, 50, 0.45)',
        border: '1px solid var(--border-glass)',
        borderRadius: '14px',
        padding: '1.25rem 1rem',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          margin: '0 auto 0.75rem',
          borderRadius: '50%',
          backgroundColor: 'rgba(212, 163, 115, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#E8D7A6'
        }}>
          <Scale size={20} />
        </div>
        <p style={{ fontSize: '0.78rem', color: '#B7AFC4', fontStyle: 'italic', lineHeight: 1.4 }}>
          "El derecho como herramienta para un mejor futuro."
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
