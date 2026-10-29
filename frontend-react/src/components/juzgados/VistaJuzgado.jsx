import { useContext, useState } from 'react';
import { EstudioContext } from '../../context/EstudioContext';
import FormularioJuzgado from './FormularioJuzgado';
import JuzgadoItem from './JuzgadoItem';
import { Landmark, Search, Loader2, AlertCircle } from 'lucide-react';

function VistaJuzgado() {
  const { juzgados, isLoading, error, agregarJuzgado, actualizarJuzgado, eliminarJuzgado, reactivarJuzgado } =
    useContext(EstudioContext);

  const [busqueda, setBusqueda] = useState('');

  const juzgadosFiltrados = juzgados.filter((j) => {
    const texto = `${j.NroJuzgado} ${j.NombreJuzgado} ${j.Jueztram} ${j.Secretario}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div>
      <FormularioJuzgado onJuzgadoAgregado={agregarJuzgado} />

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
              <Landmark size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 600 }}>
                Nómina de Juzgados Registrados
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Mostrando {juzgadosFiltrados.length} de {juzgados.length} juzgados
              </p>
            </div>
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar por nombre, número o juez..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ paddingLeft: '2.5rem', minWidth: '280px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.9rem', color: 'var(--brand-accent-light)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Cargando nómina de juzgados...</span>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', color: 'var(--danger-text)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && (
        juzgadosFiltrados.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              No se encontraron juzgados registrados.
            </p>
          </div>
        ) : (
          <div className="clientes-list">
            {juzgadosFiltrados.map((juzgado) => (
              <JuzgadoItem
                key={juzgado.Id}
                juzgado={juzgado}
                onEliminar={eliminarJuzgado}
                onGuardar={actualizarJuzgado}
                onReactivar={reactivarJuzgado}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default VistaJuzgado;
