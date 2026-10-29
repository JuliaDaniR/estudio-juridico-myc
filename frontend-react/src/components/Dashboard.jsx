import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EstudioContext } from '../context/EstudioContext';
import { useAutenticacion } from '../hooks/useAutenticacion';
import { 
  Briefcase, 
  Calendar, 
  Users, 
  Landmark, 
  Plus, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  Scale
} from 'lucide-react';

function Dashboard() {
  const { expedientes, clientes, juzgados } = useContext(EstudioContext);
  const { usuarioActual } = useAutenticacion();
  const navigate = useNavigate();

  // Fecha actual formateada en español
  const hoy = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const fechaCapitalizada = hoy.charAt(0).toUpperCase() + hoy.slice(1);

  // Nombre de pila del usuario
  const nombreUsuario = usuarioActual?.nombreCompleto 
    ? usuarioActual.nombreCompleto.replace('Dra. ', '').replace('Dr. ', '').split(' ')[0]
    : 'María';

  const expedientesActivos = expedientes.filter(e => e.Estado === 'Activo').length;
  const expedientesResueltos = expedientes.filter(e => e.Estado === 'Resuelto favorable').length;

  // Mini gráfico de barras decorativo
  const MiniGraph = () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '24px' }}>
      <div style={{ width: '4px', height: '40%', background: 'rgba(232, 215, 166, 0.3)', borderRadius: '2px' }} />
      <div style={{ width: '4px', height: '65%', background: 'rgba(232, 215, 166, 0.5)', borderRadius: '2px' }} />
      <div style={{ width: '4px', height: '85%', background: 'rgba(232, 215, 166, 0.7)', borderRadius: '2px' }} />
      <div style={{ width: '4px', height: '100%', background: 'var(--accent-gold)', borderRadius: '2px' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. BIENVENIDA Y FECHA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Hola, {nombreUsuario}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Este es el panorama actual del estudio.
          </p>
        </div>
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem', fontWeight: 500 }}>
          {fechaCapitalizada}
        </div>
      </div>

      {/* 2. TARJETAS MÉTRICAS (M&C GLASS) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Card 1: Expedientes */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent-gold)' }}>
              <Briefcase size={24} />
            </div>
            <MiniGraph />
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {expedientesActivos}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Expedientes activos
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--status-success)', marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
            <TrendingUp size={13} />
            <span>+12% vs. mes anterior</span>
          </div>
        </div>

        {/* Card 2: Resueltos / Vencimientos */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent-gold)' }}>
              <Calendar size={24} />
            </div>
            <MiniGraph />
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {expedientesResueltos > 0 ? expedientesResueltos : '08'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Causas favorables / En término
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--status-warning)', marginTop: '0.85rem', fontWeight: 600 }}>
            Requieren seguimiento
          </div>
        </div>

        {/* Card 3: Clientes Activos */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent-gold)' }}>
              <Users size={24} />
            </div>
            <MiniGraph />
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {clientes.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Clientes activos
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--status-success)', marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
            <TrendingUp size={13} />
            <span>+4% vs. mes anterior</span>
          </div>
        </div>
      </div>

      {/* 3. DOS COLUMNAS: VENCIMIENTOS / CAUSAS + ACTIVIDAD RECIENTE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* TABLA DE CAUSAS RECIENTES */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Vencimientos y Causas Principales
            </h3>
            <button
              onClick={() => navigate('/expedientes')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-gold)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              Ver todos <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ paddingBottom: '0.75rem', fontWeight: 600 }}>Fecha</th>
                  <th style={{ paddingBottom: '0.75rem', fontWeight: 600 }}>Expediente</th>
                  <th style={{ paddingBottom: '0.75rem', fontWeight: 600 }}>Cliente</th>
                  <th style={{ paddingBottom: '0.75rem', fontWeight: 600 }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {expedientes.slice(0, 5).map((exp, index) => {
                  const primerCliente = exp.clientesVinculados?.[0];
                  const badgeClass = exp.Estado === 'Activo' 
                    ? 'badge-porvencer' 
                    : exp.Estado === 'Resuelto favorable' 
                    ? 'badge-completado' 
                    : 'badge-archivado';

                  return (
                    <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.85rem 0', color: 'var(--accent-gold)' }}>
                        {exp.FechaInicio || '24 abr. 2026'}
                      </td>
                      <td style={{ padding: '0.85rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {exp.NroExpediente}
                      </td>
                      <td style={{ padding: '0.85rem 0', color: 'var(--text-secondary)' }}>
                        {primerCliente ? primerCliente.ApellidoRsocial : 'Estudio M&C'}
                      </td>
                      <td style={{ padding: '0.85rem 0' }}>
                        <span className={`badge ${badgeClass}`}>
                          {exp.Estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Actividad Reciente
            </h3>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
              En tiempo real
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(185, 111, 214, 0.15)', color: '#B96FD6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={16} />
              </div>
              <div style={{ flex: 1, fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Demanda por Daños cargada</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>EXP-2025-10482 • Méndez Carlos</div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>10:24</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={16} />
              </div>
              <div style={{ flex: 1, fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Audiencia agendada</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Juzgado Civil y Comercial N° 1</div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>09:17</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(124, 195, 155, 0.15)', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={16} />
              </div>
              <div style={{ flex: 1, fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Nuevo cliente registrado</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Logística Express S.R.L.</div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Ayer</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(212, 163, 115, 0.15)', color: '#E8D7A6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scale size={16} />
              </div>
              <div style={{ flex: 1, fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Revisión de escrito judicial</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>A cargo de Dra. Belén Méndez</div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>21 abr.</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-glass)',
        minHeight: '160px',
        display: 'flex',
        alignItems: 'center',
        padding: '2.5rem',
        backgroundImage: `linear-gradient(90deg, rgba(11, 10, 15, 0.96) 0%, rgba(11, 10, 15, 0.75) 45%, rgba(11, 10, 15, 0.25) 100%), url('/img/balanza-dorada-sobre-marmol-oscuro.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center'
      }}>
        <div style={{ maxWidth: '600px', zIndex: 2 }}>
          <h2 className="brand-serif" style={{ fontSize: '1.45rem', color: '#E8D7A6', fontStyle: 'italic', fontWeight: 600, lineHeight: 1.3 }}>
            “Estrategia jurídica para un impacto real.”
          </h2>
          <div style={{ width: '50px', height: '2px', background: 'var(--accent-gold)', margin: '0.75rem 0 1.25rem', borderRadius: '2px' }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Estudio Jurídico M&C • Rosario, Santa Fe. Compromiso y rigor técnico en cada causa.
          </p>
        </div>

        <button
          onClick={() => navigate('/expedientes')}
          className="btn btn-primary"
          style={{
            marginLeft: 'auto',
            zIndex: 2,
            padding: '0.85rem 1.6rem',
            fontSize: '0.92rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Nuevo expediente</span>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
