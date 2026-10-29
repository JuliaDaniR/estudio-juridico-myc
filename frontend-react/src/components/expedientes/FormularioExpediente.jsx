import { useState, useContext } from 'react';
import { EstudioContext } from '../../context/EstudioContext';
import { useToast } from '../../context/ToastContext';
import { FolderPlus, Briefcase, X, Check } from 'lucide-react';

function FormularioExpediente({ onExpedienteAgregado }) {
  const { juzgados, clientes } = useContext(EstudioContext);
  const { mostrarToast } = useToast();

  const [tipoExpediente, setTipoExpediente] = useState('J'); // J: Judicial, E: Extrajudicial
  const [nroExpediente, setNroExpediente] = useState('');
  const [juzgadoId, setJuzgadoId] = useState('');
  const [caratura, setCaratura] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [tipoJuicio, setTipoJuicio] = useState('');
  const [acargode, setAcargode] = useState('Dra. María Belén Méndez');
  const [estado, setEstado] = useState('Activo');

  // Cliente a vincular
  const [clienteId, setClienteId] = useState('');
  const [demandante, setDemandante] = useState('Demandante');

  const [mostrarForm, setMostrarForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nroExpediente.trim() || !caratura.trim() || !tipoJuicio.trim() || !acargode.trim()) {
      mostrarToast('Por favor complete los campos obligatorios: Nro. Expediente, Carátula, Tipo de Juicio y Abogado a cargo.', 'warning');
      return;
    }

    const nuevo = {
      TipoExpediente: tipoExpediente,
      NroExpediente: nroExpediente.trim(),
      Juzgado: juzgadoId ? Number(juzgadoId) : null,
      Caratura: caratura.trim(),
      FechaInicio: fechaInicio,
      TipoJuicio: tipoJuicio.trim(),
      Acargode: acargode.trim(),
      Estado: estado,
      idCliente: clienteId ? Number(clienteId) : null,
      Demandante: demandante
    };

    const res = await onExpedienteAgregado(nuevo);
    if (res.success) {
      setNroExpediente('');
      setCaratura('');
      setTipoJuicio('');
      setJuzgadoId('');
      setClienteId('');
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
            <Briefcase size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 600 }}>
              Apertura de Nuevo Expediente
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Registro de causas judiciales, extrajudiciales y vinculación con clientes
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
              <FolderPlus size={16} />
              <span>Nuevo Expediente</span>
            </>
          )}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de Trámite *</label>
              <select value={tipoExpediente} onChange={(e) => setTipoExpediente(e.target.value)}>
                <option value="J">J - Judicial</option>
                <option value="E">E - Extrajudicial</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nro. de Expediente *</label>
              <input
                type="text"
                placeholder="Ej: EXP-2025-0045"
                value={nroExpediente}
                onChange={(e) => setNroExpediente(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Juzgado Interviniente</label>
              <select value={juzgadoId} onChange={(e) => setJuzgadoId(e.target.value)}>
                <option value="">-- Sin juzgado asignado / Extrajudicial --</option>
                {juzgados.map((j) => (
                  <option key={j.Id} value={j.Id}>
                    {j.NroJuzgado} - {j.NombreJuzgado}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tipo de Juicio / Fuero *</label>
              <input
                type="text"
                placeholder="Ej: Daños y Perjuicios / Laboral / Sucesión"
                value={tipoJuicio}
                onChange={(e) => setTipoJuicio(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Abogado/a a Cargo *</label>
              <input
                type="text"
                placeholder="Ej: Dra. María Belén Méndez"
                value={acargode}
                onChange={(e) => setAcargode(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Fecha de Inicio *</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Estado Inicial</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="Activo">Activo</option>
                <option value="Resuelto favorable">Resuelto favorable</option>
                <option value="Archivado">Archivado</option>
              </select>
            </div>

            {/* Vinculación con Cliente */}
            <div className="form-group">
              <label>Vincular Cliente Inicial</label>
              <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                <option value="">-- Seleccionar cliente del padrón --</option>
                {clientes.map((c) => (
                  <option key={c.Id} value={c.Id}>
                    {c.ApellidoRsocial}, {c.Nombres} ({c.TipoDni})
                  </option>
                ))}
              </select>
            </div>

            {clienteId && (
              <div className="form-group">
                <label>Carácter del Cliente</label>
                <select value={demandante} onChange={(e) => setDemandante(e.target.value)}>
                  <option value="Demandante">Demandante / Actor</option>
                  <option value="Demandado">Demandado</option>
                </select>
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label>Carátula / Descripción de la Causa *</label>
            <textarea
              rows="3"
              placeholder="Ej: Méndez Carlos c/ Aseguradora del Plata s/ Daños y Perjuicios por Incumplimiento Contractual"
              value={caratura}
              onChange={(e) => setCaratura(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setMostrarForm(false)}>
              <X size={15} />
              <span>Cancelar</span>
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={15} />
              <span>Registrar Expediente</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FormularioExpediente;
