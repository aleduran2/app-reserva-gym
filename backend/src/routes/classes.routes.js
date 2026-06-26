const express = require('express');
const { listClasses, getClassById } = require('../controllers/classes.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Para esta app, ver las clases también requiere estar logueado.
// Si quisieras que cualquiera pueda ver el listado sin login, sacá requireAuth de esta línea.
router.get('/', requireAuth, listClasses);
router.get('/:id', requireAuth, getClassById);

module.exports = router;
