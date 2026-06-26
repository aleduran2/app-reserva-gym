/**
 * controllers/classes.controller.js
 * --------------------------------------------------------------------------
 * Lista las clases del gimnasio y calcula cuántos lugares quedan libres
 * en cada una, en base a las reservas existentes.
 * --------------------------------------------------------------------------
 */

const { readDb } = require('../db');

function clasesConCupoDisponible(db) {
  return db.classes.map((clase) => {
    const reservasDeEstaClase = db.reservations.filter((r) => r.classId === clase.id);
    const cupoDisponible = clase.cupo - reservasDeEstaClase.length;
    return {
      ...clase,
      cupoDisponible: Math.max(cupoDisponible, 0),
    };
  });
}

function listClasses(req, res) {
  const db = readDb();
  return res.json({ classes: clasesConCupoDisponible(db) });
}

function getClassById(req, res) {
  const db = readDb();
  const clase = db.classes.find((c) => c.id === req.params.id);

  if (!clase) {
    return res.status(404).json({ error: 'Clase no encontrada.' });
  }

  const [claseConCupo] = clasesConCupoDisponible(db).filter((c) => c.id === clase.id);
  return res.json({ class: claseConCupo });
}

module.exports = { listClasses, getClassById };
