import { useState, useContext } from 'react';
import { EstudioContext } from '../../context/EstudioContext';
import ModalDocumentos from './ModalDocumentos';
import ModalConfirmacionBaja from '../common/ModalConfirmacionBaja';
import { 
  Briefcase, 
  Scale, 
  FileText, 
  Landmark, 
  User, 
  Calendar, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  Users,
  FolderArchive,
  RefreshCw
} from 'lucide-react';

function ExpedienteItem({ expediente, onEliminar, onGuardar, onReactivar }) {
  const { juzgados } = useContext(EstudioContext);
  const [edicion, setEdicion] = useState(false);
  const [mostrarDocs, setMostrarDocs] = useState(false);
  const [mostrarModalBaja, setMostrarModalBaja] = useState(false);

  // Estados locales para edición
  const [tipoExpediente, setTipoExpediente] = useState(expediente.TipoExpediente || 'J');
  const [nroExpediente, setNroExpediente] = useState(expediente.NroExpediente || '');
  const [juzgadoId, setJuzgadoId] = useState(expediente.idJuzgado || '');
  const [caratura, setCaratura] = useState(expediente.Caratura || '');
  const [fechaInicio, setFechaInicio] = useState(expediente.FechaInicio || '');
  const [tipoJuicio, setTipoJuicio] = useState(expediente.TipoJuicio || '');
  const [acargode, setAcargode] = useState(expediente.Acargode || '');
  const [fechaFin, setFechaFin] = useState(expediente.FechaFin || '');
  const [estado, setEstado] = useState(expediente.Estado || 'Activo');

  const esInactivo = Boolean(expediente.FechaBaja || expediente.Estado === 'Archivado');

  const handleEliminar = () => {
    setMostrarModalBaja(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const res = await onGuardar(expediente.Id, {
      TipoExpediente: tipoExpediente,
      NroExpediente: nroExpediente.trim(),
      Juzgado: juzgadoId ? Number(juzgadoId) : null,
      Caratura: caratura.trim(),
      FechaInicio: fechaInicio,
      TipoJuicio: tipoJuicio.trim(),
      Acargode: acargode.trim(),
      FechaFin: fechaFin || null,
      Estado: estado,
    });
    if (res.success) {
      setEdicion(false);
    }
  };

  const cancelarEdicion = () => {
    setTipoExpediente(expediente.TipoExpediente || 'J');
    setNroExpediente(expediente.NroExpediente || '');
    setJuzgadoId(expediente.idJuzgado || '');
    setCaratura(expediente.Caratura || '');
    setFechaInicio(expediente.FechaInicio || '');
    setTipoJuicio(expediente.TipoJuicio || '');
    setAcargode(expediente.Acargode || '');
    setFechaFin(expediente.FechaFin || '');
    setEstado(expediente.Estado || 'Activo');
    setEdicion(false);
  };

  if (edicion) {
    return (
      <div className="card">
        <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
          <Edit3 size={18} />
          <span>Editando Expediente #{expediente.Id} ({expediente.NroExpediente})</span>
        </h4>
        <form onSubmit={handleGuardar}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo</label>
              <select value={tipoExpediente} onChange={(e) => setTipoExpediente(e.target.value)}>
                <option value="J">Judicial</option>
                <option value="E">Extrajudicial</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nro. Expediente</label>
              <input value={nroExpediente} onChange={(e) => setNroExpediente(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Juzgado</label>
              <select value={juzgadoId} onChange={(e) => setJuzgadoId(e.target.value)}>
                <option value="">-- Sin Juzgado --</option>
                {juzgados.map((j) => (
                  <option key={j.Id} value={j.Id}>{j.NroJuzgado} - {j.NombreJuzgado}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tipo de Juicio</label>
              <input value={tipoJuicio} onChange={(e) => setTipoJuicio(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Abogado a Cargo</label>
              <input value={acargode} onChange={(e) => setAcargode(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="Activo">Activo</option>
                <option value="Resuelto favorable">Resuelto favorable</option>
                <option value="Archivado">Archivado</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha Fin (Resolución)</label>
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Carátula</label>
            <textarea
              rows="2"
              value={caratura}
              onChange={(e) => setCaratura(e.target.value)}
              required
            />
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={cancelarEdicion}>
              <X size={15} />
              <span>Cancelar</span>
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={15} />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Estilos de badge según el estado
  const badgeEstado = {
    Activo: { bg: 'var(--status-active-bg)', text: 'var(--status-active-text)' },
    'Resuelto favorable': { bg: 'var(--status-resolved-bg)', text: 'var(--status-resolved-text)' },
    Archivado: { bg: 'var(--status-archived-bg)', text: 'var(--status-archived-text)' }
  }[expediente.Estado] || { bg: 'var(--status-archived-bg)', text: 'var(--status-archived-text)' };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Cabecera con Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
            <span className="badge" style={{
              backgroundColor: expediente.TipoExpediente === 'J' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(20, 184, 166, 0.15)',
              color: expediente.TipoExpediente === 'J' ? '#a5b4fc' : '#5eead4'
            }}>
              {expediente.TipoExpediente === 'J' ? <Scale size={12} /> : <FileText size={12} />}
              <span>{expediente.TipoExpediente === 'J' ? 'Judicial' : 'Extrajudicial'}</span>
            </span>

            <span className="badge" style={{ backgroundColor: badgeEstado.bg, color: badgeEstado.text }}>
              {expediente.Estado}
            </span>
          </div>

          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
            {expediente.NroExpediente}
          </span>
        </div>

        {/* Carátula */}
        <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.75rem', lineHeight: 1.4, fontWeight: 600 }}>
          {expediente.Caratura}
        </h3>

        {/* Datos clave */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Landmark size={14} color="var(--accent-gold)" />
            <span><strong>Radicación:</strong> {expediente.NombreJuzgado ? `${expediente.NroJuzgado} - ${expediente.NombreJuzgado}` : 'Sin juzgado (Extrajudicial)'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={14} color="var(--accent-gold)" />
            <span><strong>Fuero:</strong> {expediente.TipoJuicio}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={14} color="var(--accent-gold)" />
            <span><strong>Responsable:</strong> {expediente.Acargode}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} color="var(--accent-gold)" />
            <span><strong>Inicio:</strong> {expediente.FechaInicio} {expediente.FechaFin && ` | Fin: ${expediente.FechaFin}`}</span>
          </div>
        </div>

        {/* Clientes Vinculados (Cliente_Expediente) */}
        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Users size={12} />
            <span>Partes Vinculadas:</span>
          </div>

          {expediente.clientesVinculados && expediente.clientesVinculados.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {expediente.clientesVinculados.map((cli, idx) => (
                <div key={idx} style={{ fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-main)' }}>{cli.ApellidoRsocial}, {cli.Nombres}</span>
                  <span className="badge" style={{
                    backgroundColor: cli.Demandante === 'Demandante' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                    color: cli.Demandante === 'Demandante' ? '#93c5fd' : '#f472b6',
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem'
                  }}>
                    {cli.Demandante}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
              Sin clientes asociados aún
            </span>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {esInactivo && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ color: 'var(--status-success)', borderColor: 'rgba(124, 195, 155, 0.4)' }}
            onClick={() => onReactivar && onReactivar(expediente.Id)}
            title="Reactivar causa judicial/extrajudicial"
          >
            <RefreshCw size={14} />
            <span>Reactivar</span>
          </button>
        )}
        <button 
          type="button" 
          className="btn btn-secondary" 
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
          onClick={() => setMostrarDocs(true)}
          title="Ver y adjuntar escritos y documentación asociada a esta causa"
        >
          <FolderArchive size={14} color="var(--brand-accent-light)" />
          <span>Documentos</span>
        </button>
        <button className="btn btn-edit" onClick={() => setEdicion(true)}>
          <Edit3 size={14} />
          <span>Editar</span>
        </button>
        <button className="btn btn-danger" onClick={handleEliminar} title={esInactivo ? "Opciones de eliminación" : "Baja de expediente"}>
          <Trash2 size={14} />
          <span>{esInactivo ? 'Eliminar' : 'Baja / Eliminar'}</span>
        </button>
      </div>

      {/* Modal de Gestión de Documentación de la causa */}
      {mostrarDocs && (
        <ModalDocumentos 
          expediente={expediente} 
          onClose={() => setMostrarDocs(false)} 
        />
      )}

      {/* Modal de Opciones de Baja / Inactivación / Eliminación Definitiva */}
      <ModalConfirmacionBaja
        abierto={mostrarModalBaja}
        onClose={() => setMostrarModalBaja(false)}
        entidadNombre="Expediente"
        titulo={esInactivo ? `Gestión de Expediente Archivado: ${expediente.NroExpediente}` : `Baja de Expediente: ${expediente.NroExpediente}`}
        subtitulo={`Carátula: ${expediente.Caratura}`}
        esInactivo={esInactivo}
        onConfirmarBajaLogica={async () => {
          setMostrarModalBaja(false);
          await onEliminar(expediente.Id, 'soft');
        }}
        onConfirmarDefinitivo={async () => {
          setMostrarModalBaja(false);
          await onEliminar(expediente.Id, 'definitivo');
        }}
        onReactivar={async () => {
          setMostrarModalBaja(false);
          if (onReactivar) {
            await onReactivar(expediente.Id);
          }
        }}
      />
    </div>
  );
}

export default ExpedienteItem;
