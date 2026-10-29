import { useState } from 'react';
import { UserPlus, X, Check, UserCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

function FormularioCliente({ onClienteAgregado }) {
  const { mostrarToast } = useToast();
  const [tipoPersona, setTipoPersona] = useState('1'); // 1: Física, 2: Jurídica
  const [tipoDni, setTipoDni] = useState('');
  const [apellidoRsocial, setApellidoRsocial] = useState('');
  const [nombres, setNombres] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [cpostal, setCpostal] = useState('');
  const [fnacimiento, setFnacimiento] = useState('');
  const [falta, setFalta] = useState(new Date().toISOString().split('T')[0]);

  const [mostrarForm, setMostrarForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoDni.trim() || !apellidoRsocial.trim() || !nombres.trim() || !telefono.trim()) {
      mostrarToast('Por favor complete los campos obligatorios: DNI/CUIT, Apellido/Razón Social, Nombres y Teléfono.', 'warning');
      return;
    }

    const nuevoCliente = {
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
      Falta: falta || new Date().toISOString().split('T')[0]
    };

    const res = await onClienteAgregado(nuevoCliente);
    if (res.success) {
      setTipoPersona('1');
      setTipoDni('');
      setApellidoRsocial('');
      setNombres('');
      setDomicilio('');
      setTelefono('');
      setEmail('');
      setLocalidad('');
      setCpostal('');
      setFnacimiento('');
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
            <UserCheck size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 600 }}>
              Registro de Nuevos Clientes
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Gestión interna de personas físicas y jurídicas del Estudio M&C
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
              <UserPlus size={16} />
              <span>Nuevo Cliente</span>
            </>
          )}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de Persona *</label>
              <select value={tipoPersona} onChange={(e) => setTipoPersona(e.target.value)}>
                <option value="1">1 - Persona Física</option>
                <option value="2">2 - Persona Jurídica</option>
              </select>
            </div>

            <div className="form-group">
              <label>{tipoPersona === '1' ? 'DNI / Identificación *' : 'CUIT de la Empresa *'}</label>
              <input
                type="text"
                placeholder={tipoPersona === '1' ? 'Ej: DNI 34.567.890' : 'Ej: CUIT 30-71234567-8'}
                value={tipoDni}
                onChange={(e) => setTipoDni(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>{tipoPersona === '1' ? 'Apellido *' : 'Razón Social *'}</label>
              <input
                type="text"
                placeholder={tipoPersona === '1' ? 'Ej: Rodríguez' : 'Ej: Acero del Litoral S.A.'}
                value={apellidoRsocial}
                onChange={(e) => setApellidoRsocial(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>{tipoPersona === '1' ? 'Nombres *' : 'Titular o Rep. Legal *'}</label>
              <input
                type="text"
                placeholder={tipoPersona === '1' ? 'Ej: Juan Ignacio' : 'Ej: Lic. Marcelo Pérez (Presidente)'}
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono de Contacto *</label>
              <input
                type="tel"
                placeholder="Ej: 341-5551234"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Domicilio (Calle, Nro, Piso)</label>
              <input
                type="text"
                placeholder="Ej: San Martín 1234 Piso 2"
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Localidad</label>
              <input
                type="text"
                placeholder="Ej: Rosario"
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Código Postal</label>
              <input
                type="text"
                placeholder="Ej: 2000"
                value={cpostal}
                onChange={(e) => setCpostal(e.target.value)}
              />
            </div>

            {tipoPersona === '1' && (
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={fnacimiento}
                  onChange={(e) => setFnacimiento(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Fecha de Alta como Cliente</label>
              <input
                type="date"
                value={falta}
                onChange={(e) => setFalta(e.target.value)}
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
              <span>Guardar Cliente</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FormularioCliente;
