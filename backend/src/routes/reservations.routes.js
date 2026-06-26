const express = require('express');
const {
  createReservation,
  listMyReservations,
  cancelReservation,
} = require('../controllers/reservations.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas de reservas requieren estar logueado.
router.use(requireAuth);

// POST   /api/reservations      -> crear una reserva { classId }
router.post('/', createReservation);

// GET    /api/reservations/me   -> mis reservas
router.get('/me', listMyReservations);

// DELETE /api/reservations/:id  -> cancelar una reserva propia
router.delete('/:id', cancelReservation);

module.exports = router;
