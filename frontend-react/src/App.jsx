import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import RutaProtegida from './components/RutaProtegida';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import VistaCliente from './components/clientes/VistaCliente';
import VistaJuzgado from './components/juzgados/VistaJuzgado';
import VistaExpediente from './components/expedientes/VistaExpediente';
import { AutenticacionProvider } from './context/AutenticacionProvider';
import { EstudioProvider } from './context/EstudioProvider';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <AutenticacionProvider>
      <Routes>
        {/* RUTA PÚBLICA: Login */}
        <Route path="/login" element={<Login />} />

        {/* RUTAS PROTEGIDAS: Layout Dark Glass con Sidebar + TopBar */}
        <Route element={<RutaProtegida />}>
          <Route
            path="/*"
            element={
              <EstudioProvider>
                <div className="app-layout">
                  <Sidebar />
                  <div className="app-content">
                    <TopBar />
                    <main className="main-scroll-area">
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/expedientes" element={<VistaExpediente />} />
                        <Route path="/clientes" element={<VistaCliente />} />
                        <Route path="/juzgados" element={<VistaJuzgado />} />
                        <Route
                          path="*"
                          element={
                            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                              <h2 className="brand-serif" style={{ color: 'var(--brand-accent-light)', marginBottom: '0.5rem' }}>
                                404 | Página no encontrada
                              </h2>
                              <p style={{ color: 'var(--text-secondary)' }}>
                                La sección a la que intenta ingresar no existe en el sistema.
                              </p>
                            </div>
                          }
                        />
                      </Routes>
                    </main>
                  </div>
                </div>
              </EstudioProvider>
            }
          />
        </Route>
      </Routes>
      </AutenticacionProvider>
    </ToastProvider>
  );
}

export default App;
