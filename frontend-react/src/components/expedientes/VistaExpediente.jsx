import { useContext, useState } from 'react';
import { EstudioContext } from '../../context/EstudioContext';
import FormularioExpediente from './FormularioExpediente';
import ExpedienteItem from './ExpedienteItem';
import { Briefcase, Search, Loader2, AlertCircle } from 'lucide-react';

function VistaExpediente() {
  const { expedientes, isLoading, error, agregarExpediente, actualizarExpediente, eliminarExpediente, reactivarExpediente } =
    useContext(EstudioContext);

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const expedientesFiltrados = expedientes.filter((exp) => {
    const texto = `${exp.NroExpediente} ${exp.Caratura} ${exp.TipoJuicio} ${exp.Acargode} ${exp.NombreJuzgado || ''}`.toLowerCase();
    const coincideTexto = texto.includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'todos' || exp.Estado === filtroEstado;
    return coincideTexto && coincideEstado;
  });

  return (
    <div>
      <FormularioExpediente onExpedienteAgregado={agregarExpediente} />

      <div className="card" style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-gold-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)'
            }}>
              <Briefcase size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 600 }}>
                Causas y Expedientes del Estudio
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Mostrando {expedientesFiltrados.length} de {expedientes.length} causas activas e históricas
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Buscar carátula, número, abogado..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ paddingLeft: '2.5rem', minWidth: '280px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.9rem', color: 'var(--brand-accent-light)', pointerEvents: 'none' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                style={{ minWidth: '185px' }}
              >
                <option value="todos">Todos los estados</option>
                <option value="Activo">Activos</option>
                <option value="Resuelto favorable">Resueltos favorables</option>
                <option value="Archivado">Archivados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Cargando causas del estudio...</span>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', color: 'var(--danger-text)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && (
        expedientesFiltrados.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              No se encontraron expedientes con los criterios de búsqueda.
            </p>
          </div>
        ) : (
          <div className="clientes-list">
            {expedientesFiltrados.map((expediente) => (
              <ExpedienteItem
                key={expediente.Id}
                expediente={expediente}
                onEliminar={eliminarExpediente}
                onGuardar={actualizarExpediente}
                onReactivar={reactivarExpediente}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default VistaExpediente;
