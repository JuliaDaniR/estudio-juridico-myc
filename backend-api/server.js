import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './src/db.js';
import clientesRoutes from './src/routes/clientes.routes.js'; 
import juzgadosRoutes from './src/routes/juzgados.routes.js'; 
import expedientesRoutes from './src/routes/expedientes.routes.js';
import autenticacionRoutes from './src/routes/autenticacion.routes.js';
import documentosRoutes from './src/routes/documentos.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales (50mb para soportar documentos y PDFs Base64)
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rutas de la API
app.use('/api/clientes', clientesRoutes); 
app.use('/api/juzgados', juzgadosRoutes); 
app.use('/api/expedientes', expedientesRoutes);
app.use('/api/autenticacion', autenticacionRoutes);
app.use('/api/documentos', documentosRoutes);

// Ruta inicial
app.get('/', (req, res) => {
  res.send('API Estudio Jurídico M&C funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`⚖️ Servidor EstudioMYC escuchando en http://localhost:${PORT}`);
});
