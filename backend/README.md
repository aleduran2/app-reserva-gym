# Backend — API de Reservas del Gimnasio

API REST hecha con **Node.js + Express**. Maneja usuarios (registro/login con
JWT), el listado de clases del gimnasio y las reservas de cada usuario.

No usa una base de datos externa: para mantener el proyecto simple y enfocado
en aprender, los datos se guardan en un archivo `data/db.json` (ver
`src/db.js`). Es perfecto para aprender y para la demo, pero **no es apto
para producción real** (no soporta mucha concurrencia ni múltiples
servidores). Si en el futuro querés pasar a Postgres/MySQL/Mongo, solo
tenés que reescribir `src/db.js`: el resto del código no se entera del
cambio.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
cd backend
npm install
cp .env.example .env
```

Revisá el archivo `.env` y, sobre todo en un entorno real, cambiá
`JWT_SECRET` por un valor largo y aleatorio.

## Ejecutar en desarrollo

```bash
npm run dev
```

Esto levanta el servidor con `nodemon` (se reinicia solo cuando guardás un
archivo) en `http://localhost:4000`.

Para correrlo sin recarga automática:

```bash
npm start
```

Al iniciar por primera vez, el servidor crea automáticamente
`data/db.json` y lo llena con 6 clases de ejemplo (ver `src/seed.js`).

## Probar que funciona

```bash
curl http://localhost:4000/api/health
```

Debería responder algo como:

```json
{ "ok": true, "message": "API de reservas del gimnasio funcionando 💪" }
```

## Endpoints

Todas las rutas (salvo `/api/health`) devuelven y reciben JSON.

### Autenticación

| Método | Ruta              | Body                              | Auth | Descripción                  |
|--------|-------------------|------------------------------------|------|-------------------------------|
| POST   | /api/auth/register| `{ nombre, email, password }`      | No   | Crea una cuenta y devuelve token |
| POST   | /api/auth/login   | `{ email, password }`              | No   | Inicia sesión y devuelve token |
| GET    | /api/auth/me      | —                                  | Sí   | Datos del usuario logueado    |

### Clases

| Método | Ruta              | Auth | Descripción                          |
|--------|-------------------|------|----------------------------------------|
| GET    | /api/classes      | Sí   | Lista todas las clases con cupo disponible |
| GET    | /api/classes/:id  | Sí   | Detalle de una clase                  |

### Reservas

| Método | Ruta                  | Body              | Auth | Descripción                  |
|--------|-----------------------|-------------------|------|--------------------------------|
| POST   | /api/reservations     | `{ classId }`     | Sí   | Crea una reserva              |
| GET    | /api/reservations/me  | —                 | Sí   | Lista mis reservas            |
| DELETE | /api/reservations/:id | —                 | Sí   | Cancela una reserva propia    |

### Autenticación con JWT

Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene en la respuesta de `/register` o `/login`, y hay que
guardarlo en la app (en el caso de la app móvil, se guarda con
`AsyncStorage`, ver `mobile/src/context/AuthContext.js`).

## Probar la API a mano con curl

```bash
# Registrarse
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","email":"ana@mail.com","password":"123456"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@mail.com","password":"123456"}'

# Listar clases (reemplazá TOKEN por el que te devolvió el login)
curl http://localhost:4000/api/classes \
  -H "Authorization: Bearer TOKEN"

# Reservar la clase con id "1"
curl -X POST http://localhost:4000/api/reservations \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"classId":"1"}'

# Ver mis reservas
curl http://localhost:4000/api/reservations/me \
  -H "Authorization: Bearer TOKEN"
```

## Cómo te tiene que ver el celular/emulador

Cuando corras la app de Expo en un celular físico o en un emulador, `localhost`
**no** apunta a tu computadora. Mirá la sección correspondiente en
`mobile/README.md` para configurar la URL correcta de la API.
