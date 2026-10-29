import { Search, Bell, LogOut, UserCircle } from 'lucide-react';
import { useAutenticacion } from '../hooks/useAutenticacion';

function TopBar() {
  const { usuarioActual, cerrarSesion } = useAutenticacion();

  return (
    <header className="top-bar">
      {/* BARRA DE BÚSQUEDA GLOBAL CON SHORTCUT */}
      <div style={{ position: 'relative', width: '380px', maxWidth: '100%' }}>
        <input
          type="text"
          placeholder="Buscar expedientes, clientes o documentos..."
          style={{
            width: '100%',
            padding: '0.65rem 1rem 0.65rem 2.5rem',
            background: 'rgba(26, 22, 32, 0.65)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-pill)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem'
          }}
        />
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '0.95rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)'
          }}
        />
        <div style={{
          position: 'absolute',
          right: '0.85rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '0.7rem',
          color: 'var(--text-tertiary)',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          padding: '0.15rem 0.45rem',
          borderRadius: '4px',
          fontWeight: 600
        }}>
          ⌘ K
        </div>
      </div>

      {/* ÁREA DERECHA: NOTIFICACIONES Y PERFIL */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Notificaciones */}
        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: '0.4rem'
          }}
          title="Notificaciones"
        >
          <Bell size={19} />
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--accent-gold)',
            borderRadius: '50%'
          }} />
        </button>

        {/* Perfil del Usuario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', borderLeft: '1px solid var(--border-glass)', paddingLeft: '1.25rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-eggplant) 0%, var(--accent-gold) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0B0A0F',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            {usuarioActual?.nombreCompleto ? usuarioActual.nombreCompleto.split(' ')[0][0] : 'M'}
          </div>

          <div style={{ fontSize: '0.82rem', lineHeight: 1.25 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {usuarioActual?.nombreCompleto || 'Dra. María Belén Méndez'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {usuarioActual?.rol === 'abogado' ? 'Socia / Abogada' : usuarioActual?.rol}
            </div>
          </div>

          <button
            onClick={cerrarSesion}
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginLeft: '0.5rem'
            }}
            title="Cerrar sesión"
          >
            <LogOut size={14} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
