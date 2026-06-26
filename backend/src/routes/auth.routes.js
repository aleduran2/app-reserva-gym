const express = require('express');
const { register, login, me } = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register  -> crear cuenta nueva
router.post('/register', register);

// POST /api/auth/login     -> iniciar sesión
router.post('/login', login);

// GET  /api/auth/me        -> datos del usuario autenticado (requiere token)
router.get('/me', requireAuth, me);

module.exports = router;
