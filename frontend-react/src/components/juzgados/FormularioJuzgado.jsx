import { useState } from 'react';
import { Landmark, Plus, X, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

function FormularioJuzgado({ onJuzgadoAgregado }) {
  const { mostrarToast } = useToast();
  const [nroJuzgado, setNroJuzgado] = useState('');
  const [nombreJuzgado, setNombreJuzgado] = useState('');
  const [jueztram, setJueztram] = useState('');
  const [secretario, setSecretario] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nroJuzgado.trim() || !nombreJuzgado.trim()) {
      mostrarToast('Por favor complete el Número y el Nombre del Juzgado.', 'warning');
      return;
    }

    const nuevo = {
      NroJuzgado: nroJuzgado.trim(),
      NombreJuzgado: nombreJuzgado.trim(),
      Jueztram: jueztram.trim(),
      Secretario: secretario.trim(),
      Telefono: telefono.trim(),
    };

    const res = await onJuzgadoAgregado(nuevo);
    if (res.success) {
      setNroJuzgado('');
      setNombreJuzgado('');
      setJueztram('');
      setSecretario('');
      setTelefono('');
      setMostrarForm(false);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent-gold-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)'
          }}>
            <Landmark size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 600 }}>
              Registro de Juzgados Intervinientes
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Administración de fueros, secretarías y autoridades judiciales
            </p>
          </div>
        </div>

        <button
          className={`btn ${mostrarForm ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? (
            <>
              <X size={16} />
              <span>Cerrar</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Nuevo Juzgado</span>
            </>
          )}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nro. de Juzgado *</label>
              <input
                type="text"
                placeholder="Ej: N° 12"
                value={nroJuzgado}
                onChange={(e) => setNroJuzgado(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Nombre del Juzgado *</label>
              <input
                type="text"
                placeholder="Ej: Juzgado de Primera Instancia en lo Civil y Comercial"
                value={nombreJuzgado}
                onChange={(e) => setNombreJuzgado(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Juez de Trámite</label>
              <input
                type="text"
                placeholder="Ej: Dr. Jorge Zapata"
                value={jueztram}
                onChange={(e) => setJueztram(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Secretario/a</label>
              <input
                type="text"
                placeholder="Ej: Dra. Mariana López"
                value={secretario}
                onChange={(e) => setSecretario(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Teléfono del Juzgado</label>
              <input
                type="tel"
                placeholder="Ej: 0341-4721000 Int. 204"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setMostrarForm(false)}>
              <X size={15} />
              <span>Cancelar</span>
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={15} />
              <span>Guardar Juzgado</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FormularioJuzgado;
