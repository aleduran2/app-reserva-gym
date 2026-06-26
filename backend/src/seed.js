/**
 * seed.js
 * --------------------------------------------------------------------------
 * Carga clases de ejemplo en la base de datos si todavía no existen.
 * Se ejecuta automáticamente al iniciar el servidor (ver server.js).
 * --------------------------------------------------------------------------
 */

const { readDb, writeDb } = require('./db');

const CLASES_DEMO = [
  {
    nombre: 'Funcional',
    instructor: 'Carla Gómez',
    dia: 'Lunes',
    hora: '08:00',
    duracionMinutos: 50,
    cupo: 12,
    descripcion: 'Entrenamiento funcional de intensidad media-alta para todo el cuerpo.',
  },
  {
    nombre: 'Spinning',
    instructor: 'Diego Pérez',
    dia: 'Lunes',
    hora: '19:00',
    duracionMinutos: 45,
    cupo: 15,
    descripcion: 'Clase de bicicleta fija al ritmo de la música.',
  },
  {
    nombre: 'Yoga',
    instructor: 'Lucía Fernández',
    dia: 'Martes',
    hora: '09:00',
    duracionMinutos: 60,
    cupo: 10,
    descripcion: 'Clase de yoga para todos los niveles, enfocada en flexibilidad y respiración.',
  },
  {
    nombre: 'Crossfit',
    instructor: 'Martín Sosa',
    dia: 'Miércoles',
    hora: '18:30',
    duracionMinutos: 55,
    cupo: 10,
    descripcion: 'Entrenamiento de alta intensidad combinando fuerza y cardio.',
  },
  {
    nombre: 'Boxeo',
    instructor: 'Romina Díaz',
    dia: 'Jueves',
    hora: '20:00',
    duracionMinutos: 50,
    cupo: 12,
    descripcion: 'Técnica de boxeo y acondicionamiento físico.',
  },
  {
    nombre: 'Pilates',
    instructor: 'Lucía Fernández',
    dia: 'Viernes',
    hora: '10:00',
    duracionMinutos: 50,
    cupo: 10,
    descripcion: 'Trabajo de control corporal, postura y fortalecimiento del core.',
  },
];

function seedClassesIfEmpty() {
  const db = readDb();

  if (db.classes.length > 0) {
    return; // ya hay clases cargadas, no se vuelve a sembrar
  }

  db.classes = CLASES_DEMO.map((clase, index) => ({
    id: String(index + 1),
    ...clase,
  }));

  writeDb(db);
  console.log(`Se cargaron ${db.classes.length} clases de ejemplo en la base de datos.`);
}

module.exports = { seedClassesIfEmpty };
