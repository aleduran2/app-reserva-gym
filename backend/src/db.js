/**
 * db.js
 * --------------------------------------------------------------------------
 * Base de datos MUY simple para fines de aprendizaje.
 *
 * En vez de conectar a Postgres/MySQL/Mongo, guardamos todo en un archivo
 * JSON (data/db.json). Esto nos permite enfocarnos en aprender Express,
 * autenticación con JWT y el consumo de la API desde React Native, sin
 * pelear con drivers de base de datos ni módulos nativos.
 *
 * IMPORTANTE: esto NO es apto para producción real (no escala, no es
 * seguro ante escrituras concurrentes, etc). Si más adelante querés
 * pasar a una base de datos real, lo único que tenés que cambiar son
 * las funciones de este archivo: el resto de la app (controllers) solo
 * llama a estas funciones, nunca toca el archivo directamente.
 * --------------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Estructura inicial de la "base de datos" si el archivo no existe todavía.
const EMPTY_DB = {
  users: [],
  classes: [],
  reservations: [],
};

function ensureDbFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(EMPTY_DB, null, 2));
  }
}

/** Lee todo el contenido de la base de datos desde el disco. */
function readDb() {
  ensureDbFile();
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('No se pudo leer data/db.json, se reinicia vacío.', err);
    return { ...EMPTY_DB };
  }
}

/** Escribe el objeto completo de la base de datos al disco. */
function writeDb(data) {
  ensureDbFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb, DB_FILE };
