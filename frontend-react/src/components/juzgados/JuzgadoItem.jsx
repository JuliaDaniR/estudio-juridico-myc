import { useState } from 'react';
import { Landmark, Gavel, FileText, Phone, Edit3, Trash2, X, Save, RefreshCw, AlertCircle } from 'lucide-react';
import ModalConfirmacionBaja from '../common/ModalConfirmacionBaja';

function JuzgadoItem({ juzgado, onEliminar, onGuardar, onReactivar }) {
  const [edicion, setEdicion] = useState(false);
  const [mostrarModalBaja, setMostrarModalBaja] = useState(false);
  const [nroJuzgado, setNroJuzgado] = useState(juzgado.NroJuzgado || '');
  const [nombreJuzgado, setNombreJuzgado] = useState(juzgado.NombreJuzgado || '');
  const [jueztram, setJueztram] = useState(juzgado.Jueztram || '');
  const [secretario, setSecretario] = useState(juzgado.Secretario || '');
  const [telefono, setTelefono] = useState(juzgado.Telefono || '');

  const esInactivo = (juzgado.Activo === 0 || juzgado.Activo === false);

  const handleEliminar = () => {
    setMostrarModalBaja(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const res = await onGuardar(juzgado.Id, {
      NroJuzgado: nroJuzgado.trim(),
      NombreJuzgado: nombreJuzgado.trim(),
      Jueztram: jueztram.trim(),
      Secretario: secretario.trim(),
      Telefono: telefono.trim(),
    });
    if (res.success) {
      setEdicion(false);
    }
  };

  const cancelarEdicion = () => {
    setNroJuzgado(juzgado.NroJuzgado || '');
    setNombreJuzgado(juzgado.NombreJuzgado || '');
    setJueztram(juzgado.Jueztram || '');
    setSecretario(juzgado.Secretario || '');
    setTelefono(juzgado.Telefono || '');
    setEdicion(false);
  };

  if (edicion) {
    return (
      <div className="card">
        <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
          <Edit3 size={18} />
          <span>Editando Juzgado #{juzgado.Id}</span>
        </h4>
        <form onSubmit={handleGuardar}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nro. de Juzgado</label>
              <input value={nroJuzgado} onChange={(e) => setNroJuzgado(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Nombre del Juzgado</label>
              <input value={nombreJuzgado} onChange={(e) => setNombreJuzgado(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Juez de Trámite</label>
              <input value={jueztram} onChange={(e) => setJueztram(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Secretario</label>
              <input value={secretario} onChange={(e) => setSecretario(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
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

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge" style={{ backgroundColor: 'var(--accent-gold-soft)', color: 'var(--accent-gold)' }}>
              <Landmark size={12} />
              <span>{juzgado.NroJuzgado}</span>
            </span>

            {esInactivo && (
              <span className="badge badge-inactivo" title="Juzgado desafectado o dado de baja">
                <AlertCircle size={11} />
                <span>Inactivo</span>
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            ID #{juzgado.Id}
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.85rem', fontWeight: 600 }}>
          {juzgado.NombreJuzgado}
        </h3>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gavel size={14} color="var(--accent-gold)" />
            <span><strong>Juez:</strong> {juzgado.Jueztram || 'No asignado'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={14} color="var(--accent-gold)" />
            <span><strong>Secretaría:</strong> {juzgado.Secretario || 'No asignado'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={14} color="var(--accent-gold)" />
            <span><strong>Tel:</strong> {juzgado.Telefono || 'Sin teléfono registrado'}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {esInactivo && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ color: 'var(--status-success)', borderColor: 'rgba(124, 195, 155, 0.4)' }}
            onClick={() => onReactivar && onReactivar(juzgado.Id)}
            title="Reactivar juzgado en la nómina activa"
          >
            <RefreshCw size={14} />
            <span>Reactivar</span>
          </button>
        )}
        <button className="btn btn-edit" onClick={() => setEdicion(true)}>
          <Edit3 size={14} />
          <span>Editar</span>
        </button>
        <button className="btn btn-danger" onClick={handleEliminar} title={esInactivo ? "Opciones de eliminación" : "Baja de juzgado"}>
          <Trash2 size={14} />
          <span>{esInactivo ? 'Eliminar' : 'Baja / Eliminar'}</span>
        </button>
      </div>

      <ModalConfirmacionBaja
        abierto={mostrarModalBaja}
        onClose={() => setMostrarModalBaja(false)}
        entidadNombre="Juzgado"
        titulo={esInactivo ? `Gestión de Juzgado Inactivo: ${juzgado.NombreJuzgado}` : `Baja de Juzgado: ${juzgado.NombreJuzgado}`}
        subtitulo={`Juzgado N° ${juzgado.NroJuzgado}`}
        esInactivo={esInactivo}
        onConfirmarBajaLogica={async () => {
          setMostrarModalBaja(false);
          await onEliminar(juzgado.Id, 'soft');
        }}
        onConfirmarDefinitivo={async () => {
          setMostrarModalBaja(false);
          await onEliminar(juzgado.Id, 'definitivo');
        }}
        onReactivar={async () => {
          setMostrarModalBaja(false);
          if (onReactivar) {
            await onReactivar(juzgado.Id);
          }
        }}
      />
    </div>
  );
}

export default JuzgadoItem;
