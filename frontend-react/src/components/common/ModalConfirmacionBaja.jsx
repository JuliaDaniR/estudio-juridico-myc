import { createPortal } from 'react-dom';
import { 
  AlertTriangle, 
  Trash2, 
  Archive, 
  RefreshCw, 
  X, 
  CheckCircle2
} from 'lucide-react';

function ModalConfirmacionBaja({
  abierto,
  onClose,
  onConfirmarBajaLogica,
  onConfirmarDefinitivo,
  onReactivar,
  titulo,
  subtitulo,
  esInactivo = false,
  entidadNombre = 'registro'
}) {
  if (!abierto) return null;

  const contenido = (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px', padding: '2rem' }}
      >
        {/* Cabecera del diálogo */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: esInactivo ? 'rgba(124, 195, 155, 0.15)' : 'rgba(226, 179, 90, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: esInactivo ? 'var(--status-success)' : 'var(--status-warning)',
              flexShrink: 0
            }}>
              {esInactivo ? <RefreshCw size={22} /> : <AlertTriangle size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>
                {titulo || (esInactivo ? `Reactivar ${entidadNombre}` : `Opciones de Baja / Eliminación`)}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {subtitulo || (esInactivo ? 'El registro se encuentra actualmente inactivo en el sistema.' : 'Seleccione el tipo de baja según el principio de trazabilidad jurídica.')}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            title="Cancelar"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tarjeta Informativa sobre Trazabilidad */}
        <div style={{
          backgroundColor: 'rgba(16, 12, 18, 0.7)',
          border: '1px solid var(--glass-border)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.5rem',
          fontSize: '0.84rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5
        }}>
          {esInactivo ? (
            <p>
              Al <strong>reactivar</strong>, este {entidadNombre.toLowerCase()} volverá a estar disponible en el padrón activo y en la vinculación de expedientes.
            </p>
          ) : (
            <p>
              <strong>Principio de Trazabilidad:</strong> En la gestión jurídica se recomienda la <strong>baja lógica</strong> para preservar el historial de causas, escritos y auditoría sin alterar la integridad de la base de datos.
            </p>
          )}
        </div>

        {/* Opciones de Acción */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {esInactivo ? (
            // Opción Reactivar
            <button
              type="button"
              className="button-primary"
              onClick={onReactivar}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '0.75rem',
                fontSize: '0.92rem'
              }}
            >
              <CheckCircle2 size={18} />
              <span>Reactivar {entidadNombre}</span>
            </button>
          ) : (
            // Opción 1: Baja Lógica (Soft Delete)
            <button
              type="button"
              className="button-primary"
              onClick={onConfirmarBajaLogica}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.25rem',
                fontSize: '0.9rem',
                backgroundColor: 'rgba(58, 43, 70, 0.75)',
                border: '1px solid var(--brand-accent)',
                color: 'var(--brand-accent-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Archive size={18} color="var(--brand-accent)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700 }}>Dar de baja lógica (Inactivar)</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Recomendado: Mantiene historial, trazabilidad y causas asociadas
                  </div>
                </div>
              </div>
            </button>
          )}

          {/* Opción 2: Eliminación Definitiva (Hard Delete) */}
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirmarDefinitivo}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.25rem',
              fontSize: '0.9rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Trash2 size={18} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>Eliminación Definitiva (Hard Delete)</div>
                <div style={{ fontSize: '0.74rem', color: 'rgba(229, 115, 115, 0.85)' }}>
                  Borra físicamente de MySQL (solo si no tiene causas vinculadas)
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Botón Cancelar */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ padding: '0.5rem 1.25rem' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(contenido, document.body);
}

export default ModalConfirmacionBaja;
