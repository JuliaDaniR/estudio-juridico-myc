import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../hooks/useAutenticacion';
import { Scale, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const { iniciarSesion } = useAutenticacion();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const resultado = await iniciarSesion(email, password);
    setCargando(false);

    if (resultado.exito) {
      navigate('/dashboard');
    } else {
      setError(resultado.mensaje);
      setPassword('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      padding: '1.5rem',
      backgroundImage: `
        linear-gradient(135deg, rgba(11, 8, 15, 0.84) 0%, rgba(25, 18, 29, 0.78) 50%, rgba(11, 8, 15, 0.88) 100%),
        url('/img/ondas-doradas-en%20oscuridad.png')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '3rem 2.25rem',
        borderRadius: '20px',
        backgroundColor: 'rgba(25, 18, 29, 0.76)',
        backdropFilter: 'blur(22px) saturate(130%)',
        WebkitBackdropFilter: 'blur(22px) saturate(130%)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65), 0 0 45px rgba(212, 177, 106, 0.08)',
        border: '1px solid rgba(237, 218, 190, 0.22)'
      }}>
        {/* LOGO DE MARCA */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1.25rem',
            borderRadius: '16px',
            backgroundColor: 'rgba(212, 177, 106, 0.12)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-accent-light)'
          }}>
            <Scale size={32} strokeWidth={2.2} />
          </div>

          <h2 className="brand-serif" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '0.04em' }}>
            M&C
          </h2>
          <div className="brand-serif" style={{ fontSize: '0.78rem', color: 'var(--brand-accent)', letterSpacing: '0.2em', marginTop: '0.25rem' }}>
            ESTUDIO JURÍDICO
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
            Sistema de Gestión Jurídica (SGJ-M&C)
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(229, 115, 115, 0.14)',
            border: '1px solid rgba(229, 115, 115, 0.3)',
            color: 'var(--status-danger)',
            padding: '0.8rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="admin@estudiomyc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.6rem' }}
                required
              />
              <Mail size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.6rem' }}
                required
              />
              <Lock size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="button-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.75rem', fontSize: '0.92rem' }}
            disabled={cargando}
          >
            {cargando ? 'Verificando credenciales...' : (
              <>
                <span>Ingresar al Sistema</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2.25rem', textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          Acceso interno restringido a miembros acreditados del estudio
        </div>
      </div>
    </div>
  );
}

export default Login;
