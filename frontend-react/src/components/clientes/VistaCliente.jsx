import { useContext, useState } from 'react';
import { EstudioContext } from '../../context/EstudioContext';
import FormularioCliente from './FormularioCliente';
import ClienteItem from './ClienteItem';
import { Search, Users, Loader2, AlertCircle, Printer } from 'lucide-react';

function VistaCliente() {
  const { clientes, isLoading, error, agregarCliente, actualizarCliente, eliminarCliente, reactivarCliente } =
    useContext(EstudioContext);

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  // Filtrado dinámico por búsqueda o tipo
  const clientesFiltrados = clientes.filter((c) => {
    const texto = `${c.ApellidoRsocial} ${c.Nombres} ${c.TipoDni} ${c.Localidad}`.toLowerCase();
    const coincideTexto = texto.includes(busqueda.toLowerCase());
    const coincideTipo =
      filtroTipo === 'todos' ||
      (filtroTipo === 'fisica' && c.TipoPersona === 1) ||
      (filtroTipo === 'juridica' && c.TipoPersona === 2);
    return coincideTexto && coincideTipo;
  });

  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div>
      {/* Formulario de Alta */}
      <div className="no-print">
        <FormularioCliente onClienteAgregado={agregarCliente} />
      </div>

      {/* Barra de Filtros y Métricas (Solo visible en pantalla) */}
      <div className="card no-print" style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(212, 177, 106, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-accent-light)'
            }}>
              <Users size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Padrón General de Clientes
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Mostrando {clientesFiltrados.length} de {clientes.length} clientes registrados
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Buscar apellido, DNI, ciudad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ paddingLeft: '2.5rem', minWidth: '260px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '0.9rem', color: 'var(--brand-accent-light)', pointerEvents: 'none' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                style={{ minWidth: '175px' }}
              >
                <option value="todos">Todos los tipos</option>
                <option value="fisica">Personas Físicas</option>
                <option value="juridica">Personas Jurídicas</option>
              </select>
            </div>

            {/* Paso B: Botón de Imprimir / Exportar Padrón */}
            <button
              type="button"
              className="button-primary"
              onClick={() => window.print()}
              title="Imprimir Padrón o Exportar a PDF"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.15rem' }}
            >
              <Printer size={16} />
              <span>Imprimir Padrón</span>
            </button>
          </div>
        </div>
      </div>

      {/* Estados de carga o error (Pantalla) */}
      <div className="no-print">
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Cargando padrón de clientes...</span>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: 'var(--status-danger)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Listado en pantalla (Tarjetas Dark Glass) */}
        {!isLoading && !error && (
          clientesFiltrados.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem', marginTop: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                No se encontraron clientes registrados con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="clientes-list">
              {clientesFiltrados.map((cliente) => (
                <ClienteItem
                  key={cliente.Id}
                  cliente={cliente}
                  onEliminar={eliminarCliente}
                  onGuardar={actualizarCliente}
                  onReactivar={reactivarCliente}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Vista de Impresión Oficial del Padrón (Visible solo al imprimir / exportar PDF) */}
      <div className="print-only seccion-impresion-padron">
        <div className="encabezado-impresion">
          <div className="logo-estudio-print">
            <h1>ESTUDIO JURÍDICO M&amp;C</h1>
            <p className="subtitulo-print">Dra. María Belén Méndez &bull; Abogada T° 88 F° 124 C.P.A.C.F.</p>
            <p className="direccion-print">Av. Corrientes 1450, Piso 6 &bull; Tel: (011) 4378-9000 &bull; CABA</p>
          </div>
          <div className="meta-impresion">
            <span className="badge-tipo-reporte">PADRÓN GENERAL DE CLIENTES</span>
            <p><strong>Fecha de Emisión:</strong> {fechaHoy}</p>
            <p><strong>Filtro:</strong> {filtroTipo === 'todos' ? 'Todos los registros' : filtroTipo === 'fisica' ? 'Personas Físicas' : 'Personas Jurídicas'}</p>
            <p><strong>Total de Registros:</strong> {clientesFiltrados.length}</p>
          </div>
        </div>

        <table className="tabla-impresion">
          <thead>
            <tr>
              <th style={{ width: '6%' }}>ID</th>
              <th style={{ width: '14%' }}>Tipo</th>
              <th style={{ width: '16%' }}>DNI / CUIT</th>
              <th style={{ width: '28%' }}>Apellido y Nombre / Razón Social</th>
              <th style={{ width: '16%' }}>Teléfono</th>
              <th style={{ width: '20%' }}>Localidad / Domicilio</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cli) => (
              <tr key={cli.Id}>
                <td>{cli.Id}</td>
                <td>{cli.TipoPersona === 1 ? 'Persona Física' : 'Persona Jurídica'}</td>
                <td><strong>{cli.TipoDni}</strong></td>
                <td>{cli.ApellidoRsocial}{cli.Nombres ? `, ${cli.Nombres}` : ''}</td>
                <td>{cli.Telefono || '-'}</td>
                <td>{cli.Localidad || '-'}{cli.Domicilio ? ` (${cli.Domicilio})` : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pie-impresion">
          <p>Documento oficial emitido por Sistema EstudioMYC &bull; Sujeto a reserva y secreto profesional.</p>
          <div className="firma-box">
            <div className="linea-firma"></div>
            <p>Dra. María Belén Méndez</p>
            <p style={{ fontSize: '7.5pt', color: '#777' }}>Firma y Sello Profesional</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VistaCliente;
