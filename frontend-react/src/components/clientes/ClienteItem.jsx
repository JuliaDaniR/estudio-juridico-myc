import { useState } from 'react';
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CalendarOff, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  FileText,
  RefreshCw
} from 'lucide-react';
import ModalConfirmacionBaja from '../common/ModalConfirmacionBaja';

function ClienteItem({ cliente, onEliminar, onGuardar, onReactivar }) {
  const [edicion, setEdicion] = useState(false);
  const [mostrarModalBaja, setMostrarModalBaja] = useState(false);

  // Estados locales para la edición
  const [tipoPersona, setTipoPersona] = useState(cliente.TipoPersona || 1);
  const [tipoDni, setTipoDni] = useState(cliente.TipoDni || '');
  const [apellidoRsocial, setApellidoRsocial] = useState(cliente.ApellidoRsocial || '');
  const [nombres, setNombres] = useState(cliente.Nombres || '');
  const [domicilio, setDomicilio] = useState(cliente.Domicilio || '');
  const [telefono, setTelefono] = useState(cliente.Telefono || '');
  const [email, setEmail] = useState(cliente.Email || '');
  const [localidad, setLocalidad] = useState(cliente.Localidad || '');
  const [cpostal, setCpostal] = useState(cliente.Cpostal || '');
  const [fnacimiento, setFnacimiento] = useState(cliente.Fnacimiento || '');
  const [falta, setFalta] = useState(cliente.Falta || '');
  const [fbaja, setFbaja] = useState(cliente.Fbaja || '');

  const handleEliminar = () => {
    setMostrarModalBaja(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const clienteActualizado = {
      TipoPersona: Number(tipoPersona),
      TipoDni: tipoDni.trim(),
      ApellidoRsocial: apellidoRsocial.trim(),
      Nombres: nombres.trim(),
      Domicilio: domicilio.trim(),
      Telefono: telefono.trim(),
      Email: email.trim(),
      Localidad: localidad.trim(),
      Cpostal: cpostal.trim(),
      Fnacimiento: fnacimiento || null,
      Falta: falta,
      Fbaja: fbaja || null
    };

    const res = await onGuardar(cliente.Id, clienteActualizado);
    if (res.success) {
      setEdicion(false);
    }
  };

  const cancelarEdicion = () => {
    setTipoPersona(cliente.TipoPersona || 1);
    setTipoDni(cliente.TipoDni || '');
    setApellidoRsocial(cliente.ApellidoRsocial || '');
    setNombres(cliente.Nombres || '');
    setDomicilio(cliente.Domicilio || '');
    setTelefono(cliente.Telefono || '');
    setEmail(cliente.Email || '');
    setLocalidad(cliente.Localidad || '');
    setCpostal(cliente.Cpostal || '');
    setFnacimiento(cliente.Fnacimiento || '');
    setFalta(cliente.Falta || '');
    setFbaja(cliente.Fbaja || '');
    setEdicion(false);
  };

  if (edicion) {
    return (
      <div className="card">
        <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
          <Edit3 size={18} />
          <span>Editando Cliente #{cliente.Id}</span>
        </h4>
        <form onSubmit={handleGuardar}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo Persona</label>
              <select value={tipoPersona} onChange={(e) => setTipoPersona(e.target.value)}>
                <option value="1">1 - Física</option>
                <option value="2">2 - Jurídica</option>
              </select>
            </div>
            <div className="form-group">
              <label>DNI / CUIT</label>
              <input value={tipoDni} onChange={(e) => setTipoDni(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Apellido / Razón Social</label>
              <input value={apellidoRsocial} onChange={(e) => setApellidoRsocial(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Nombres / Representante</label>
              <input value={nombres} onChange={(e) => setNombres(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Domicilio</label>
              <input value={domicilio} onChange={(e) => setDomicilio(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Localidad</label>
              <input value={localidad} onChange={(e) => setLocalidad(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Postal</label>
              <input value={cpostal} onChange={(e) => setCpostal(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fecha de Baja (opcional)</label>
              <input type="date" value={fbaja} onChange={(e) => setFbaja(e.target.value)} />
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
            <span className={`badge ${cliente.TipoPersona === 1 ? 'badge-fisica' : 'badge-juridica'}`}>
              {cliente.TipoPersona === 1 ? (
                <>
                  <User size={12} />
                  <span>Persona Física</span>
                </>
              ) : (
                <>
                  <Building2 size={12} />
                  <span>Persona Jurídica</span>
                </>
              )}
            </span>

            {cliente.Fbaja && (
              <span className="badge badge-inactivo" title={`Baja lógica: ${cliente.Fbaja}`}>
                <CalendarOff size={11} />
                <span>Inactivo</span>
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            ID #{cliente.Id}
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.35rem', fontWeight: 600 }}>
          {cliente.ApellidoRsocial}, {cliente.Nombres}
        </h3>
        
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-gold)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FileText size={14} />
          <span>{cliente.TipoDni}</span>
        </p>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={14} color="var(--accent-gold)" />
            <span>{cliente.Telefono}</span>
          </div>

          {cliente.Email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={14} color="var(--accent-gold)" />
              <span>{cliente.Email}</span>
            </div>
          )}

          {cliente.Domicilio && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={14} color="var(--accent-gold)" />
              <span>{cliente.Domicilio} ({cliente.Localidad || 'S/L'})</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} color="var(--accent-gold)" />
            <span>Alta: {cliente.Falta}</span>
          </div>

          {cliente.Fbaja && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-text)' }}>
              <CalendarOff size={14} />
              <span>Baja: {cliente.Fbaja}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        {cliente.Fbaja && (
          <button 
            type="button"
            className="btn btn-secondary" 
            style={{ color: 'var(--status-success)', borderColor: 'rgba(124, 195, 155, 0.4)' }}
            onClick={() => onReactivar && onReactivar(cliente.Id)}
            title="Reactivar cliente en el padrón activo"
          >
            <RefreshCw size={14} />
            <span>Reactivar</span>
          </button>
        )}
        <button className="btn btn-edit" onClick={() => setEdicion(true)}>
          <Edit3 size={14} />
          <span>Editar</span>
        </button>
        <button className="btn btn-danger" onClick={handleEliminar} title={cliente.Fbaja ? "Opciones de eliminación" : "Baja de cliente"}>
          <Trash2 size={14} />
          <span>{cliente.Fbaja ? 'Eliminar' : 'Baja / Eliminar'}</span>
        </button>
      </div>

      <ModalConfirmacionBaja
        abierto={mostrarModalBaja}
        onClose={() => setMostrarModalBaja(false)}
        entidadNombre="Cliente"
        titulo={cliente.Fbaja ? `Gestión de Cliente Inactivo: ${cliente.ApellidoRsocial}, ${cliente.Nombres}` : `Baja de Cliente: ${cliente.ApellidoRsocial}, ${cliente.Nombres}`}
        subtitulo={`DNI/CUIT: ${cliente.TipoDni}`}
        esInactivo={Boolean(cliente.Fbaja)}
        onConfirmarBajaLogica={async () => {
          setMostrarModalBaja(false);
          await onEliminar(cliente.Id, 'soft');
        }}
        onConfirmarDefinitivo={async () => {
          setMostrarModalBaja(false);
          await onEliminar(cliente.Id, 'definitivo');
        }}
        onReactivar={async () => {
          setMostrarModalBaja(false);
          if (onReactivar) {
            await onReactivar(cliente.Id);
          }
        }}
      />
    </div>
  );
}

export default ClienteItem;
