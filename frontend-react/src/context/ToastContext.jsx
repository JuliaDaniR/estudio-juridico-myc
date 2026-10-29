import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const mostrarToast = useCallback((mensaje, tipo = 'info', duracion = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const nuevoToast = { id, mensaje, tipo };

    setToasts((prev) => [...prev, nuevoToast]);

    if (duracion > 0) {
      setTimeout(() => {
        cerrarToast(id);
      }, duracion);
    }
  }, []);

  const cerrarToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ mostrarToast, cerrarToast }}>
      {children}
      {/* Contenedor flotante de notificaciones Toasts */}
      <div className="toast-container">
        {toasts.map((toast) => {
          const config = {
            success: {
              icono: <CheckCircle size={18} color="var(--status-success)" />,
              clase: 'toast-success'
            },
            error: {
              icono: <AlertCircle size={18} color="var(--status-danger)" />,
              clase: 'toast-error'
            },
            warning: {
              icono: <AlertTriangle size={18} color="var(--status-warning)" />,
              clase: 'toast-warning'
            },
            info: {
              icono: <Info size={18} color="var(--brand-accent-light)" />,
              clase: 'toast-info'
            }
          }[toast.tipo] || {
            icono: <Info size={18} color="var(--brand-accent-light)" />,
            clase: 'toast-info'
          };

          return (
            <div key={toast.id} className={`toast-card ${config.clase}`}>
              <div className="toast-icon">{config.icono}</div>
              <div className="toast-message">{toast.mensaje}</div>
              <button
                type="button"
                className="toast-close"
                onClick={() => cerrarToast(toast.id)}
                title="Cerrar notificación"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return contexto;
}

export default ToastContext;
