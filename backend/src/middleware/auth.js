/**
 * middleware/auth.js
 * --------------------------------------------------------------------------
 * Middleware de Express que protege rutas privadas.
 *
 * Cómo funciona:
 * 1. El cliente (la app de React Native) manda el token en el header:
 *      Authorization: Bearer <token>
 * 2. Este middleware lo verifica con jsonwebtoken.
 * 3. Si es válido, guarda el id del usuario en `req.userId` y deja
 *    pasar la petición (next()).
 * 4. Si no es válido o no existe, responde 401 (no autorizado).
 * --------------------------------------------------------------------------
 */

const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'No autenticado. Falta el token.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

module.exports = { requireAuth };
