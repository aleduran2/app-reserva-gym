/**
 * controllers/reservations.controller.js
 * --------------------------------------------------------------------------
 * Crear una reserva, listar las reservas del usuario logueado y cancelar
 * una reserva propia.
 * --------------------------------------------------------------------------
 */

const crypto = require('crypto');
const { readDb, writeDb } = require('../db');

function createReservation(req, res) {
  const { classId } = req.body;

  if (!classId) {
    return res.status(400).json({ error: 'Falta el classId de la clase a reservar.' });
  }

  const db = readDb();
  const clase = db.classes.find((c) => c.id === classId);

  if (!clase) {
    return res.status(404).json({ error: 'La clase indicada no existe.' });
  }

  const yaReservada = db.reservations.find(
    (r) => r.classId === classId && r.userId === req.userId
  );
  if (yaReservada) {
    return res.status(409).json({ error: 'Ya tenés una reserva para esta clase.' });
  }

  const reservasDeEstaClase = db.reservations.filter((r) => r.classId === classId);
  if (reservasDeEstaClase.length >= clase.cupo) {
    return res.status(409).json({ error: 'No quedan lugares disponibles para esta clase.' });
  }

  const nuevaReserva = {
    id: crypto.randomUUID(),
    userId: req.userId,
    classId,
    creadaEn: new Date().toISOString(),
  };

  db.reservations.push(nuevaReserva);
  writeDb(db);

  return res.status(201).json({ reservation: { ...nuevaReserva, class: clase } });
}

function listMyReservations(req, res) {
  const db = readDb();
  const misReservas = db.reservations
    .filter((r) => r.userId === req.userId)
    .map((reserva) => {
      const clase = db.classes.find((c) => c.id === reserva.classId);
      return { ...reserva, class: clase || null };
    })
    // Mostramos primero las reservas más recientes.
    .sort((a, b) => new Date(b.creadaEn) - new Date(a.creadaEn));

  return res.json({ reservations: misReservas });
}

function cancelReservation(req, res) {
  const db = readDb();
  const reserva = db.reservations.find((r) => r.id === req.params.id);

  if (!reserva) {
    return res.status(404).json({ error: 'La reserva no existe.' });
  }

  if (reserva.userId !== req.userId) {
    return res.status(403).json({ error: 'No podés cancelar una reserva que no es tuya.' });
  }

  db.reservations = db.reservations.filter((r) => r.id !== req.params.id);
  writeDb(db);

  return res.json({ ok: true });
}

module.exports = { createReservation, listMyReservations, cancelReservation };
