/**
 * controllers/auth.controller.js
 * --------------------------------------------------------------------------
 * Lógica de registro, login y obtención del usuario autenticado.
 * --------------------------------------------------------------------------
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb, writeDb } = require('../db');

function generarToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function usuarioPublico(user) {
  // Nunca devolvemos el passwordHash al cliente.
  return { id: user.id, nombre: user.nombre, email: user.email };
}

async function register(req, res) {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos: nombre, email y password son obligatorios.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  const db = readDb();
  const emailNormalizado = email.trim().toLowerCase();

  const existe = db.users.find((u) => u.email === emailNormalizado);
  if (existe) {
    return res.status(409).json({ error: 'Ya existe una cuenta con ese email.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const nuevoUsuario = {
    id: crypto.randomUUID(),
    nombre: nombre.trim(),
    email: emailNormalizado,
    passwordHash,
    creadoEn: new Date().toISOString(),
  };

  db.users.push(nuevoUsuario);
  writeDb(db);

  const token = generarToken(nuevoUsuario.id);
  return res.status(201).json({ token, user: usuarioPublico(nuevoUsuario) });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan datos: email y password son obligatorios.' });
  }

  const db = readDb();
  const emailNormalizado = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email === emailNormalizado);

  if (!user) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
  }

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
  }

  const token = generarToken(user.id);
  return res.json({ token, user: usuarioPublico(user) });
}

function me(req, res) {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.userId);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  return res.json({ user: usuarioPublico(user) });
}

module.exports = { register, login, me };
