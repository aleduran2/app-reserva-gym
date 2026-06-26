/**
 * server.js
 * --------------------------------------------------------------------------
 * Punto de entrada del backend. Levanta el servidor Express, configura
 * middlewares globales (CORS, JSON), monta las rutas y siembra clases
 * de ejemplo en la base de datos si todavía no hay ninguna.
 * --------------------------------------------------------------------------
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { seedClassesIfEmpty } = require('./seed');
const authRoutes = require('./routes/auth.routes');
const classesRoutes = require('./routes/classes.routes');
const reservationsRoutes = require('./routes/reservations.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// Permite que la app de Expo (en otro origen/dispositivo) llame a esta API.
app.use(cors());
// Permite leer JSON en el body de los requests (req.body).
app.use(express.json());

// Endpoint simple para chequear que el servidor está vivo (útil para probar
// la conexión desde el celular antes de tocar nada de lógica de negocio).
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'API de reservas del gimnasio funcionando 💪' });
});

app.use('/api/auth', authRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/reservations', reservationsRoutes);

// Manejo simple de rutas no encontradas.
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Manejo simple de errores no controlados.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

seedClassesIfEmpty();

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log('Probá la salud de la API en GET /api/health');
});
