import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Interceptor para adjuntar el Token en cada petición
api.interceptors.request.use(
  (configuracion) => {
    const tokenGuardado = localStorage.getItem('tokenAcceso');
    if (tokenGuardado) {
      configuracion.headers.Authorization = `Bearer ${tokenGuardado}`;
    }
    return configuracion;
  },
  (error) => Promise.reject(error)
);

// Interceptor para detectar si la sesión expiró (401 o 403)
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('tokenAcceso');
      localStorage.removeItem('datosUsuario');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
