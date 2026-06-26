# App de Reservas para Gimnasio 🏋️

Proyecto completo para **aprender React Native con Expo** construyendo una
app real: login, listado de clases de un gimnasio y sistema de reservas.
Incluye el backend en Node.js que la alimenta.

> Proyecto pensado con fines educativos. La base de datos es un archivo
> JSON simple (no una base de datos real) para poder enfocarse en aprender
> Express + React Native sin complicaciones de infraestructura.

## ¿Qué incluye?

- **`backend/`** — API REST en Node.js + Express. Login/registro con JWT,
  listado de clases del gimnasio y reservas.
- **`mobile/`** — App de Expo (React Native). Pantallas de login, registro,
  listado de clases, detalle de clase con botón de reservar, y "mis
  reservas" con opción de cancelar.
- **`docs/APK_GUIDE.md`** — Guía paso a paso para generar el `.apk` y
  poder compartirlo (instalarlo en cualquier Android sin pasar por la
  Play Store).

## Arquitectura

```
┌─────────────────────┐        HTTP / JSON        ┌──────────────────────┐
│   App Expo (RN)      │ ───────────────────────▶ │  API Node + Express   │
│  mobile/              │ ◀─────────────────────── │  backend/              │
│  - Login / Registro   │      JWT en el header    │  - Auth (JWT)          │
│  - Listado de clases  │                           │  - Clases              │
│  - Reservar / cancelar│                           │  - Reservas            │
└─────────────────────┘                           └──────────┬───────────┘
                                                                │
                                                                ▼
                                                      data/db.json
                                                  (base de datos simple
                                                   en un archivo JSON)
```

## Puesta en marcha rápida

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

El servidor queda en `http://localhost:4000`. Más detalles en
[`backend/README.md`](backend/README.md).

### 2. App móvil

```bash
cd mobile
npm install
npx expo install --fix
```

Antes de correrla, editá `mobile/src/api/client.js` y ajustá `API_URL`
según cómo vayas a probarla (emulador, celular físico, etc — el archivo
tiene la explicación de cada caso). Después:

```bash
npx expo start
```

Escaneá el QR con la app **Expo Go** en tu celular, o apretá `a`
(Android) / `i` (iOS) si tenés un emulador/simulador abierto.

Más detalles en [`mobile/README.md`](mobile/README.md).

### 3. Generar el APK para compartir

Una vez que probaste la app y funciona, seguí la guía en
[`docs/APK_GUIDE.md`](docs/APK_GUIDE.md) para generar un `.apk`
instalable y compartirlo (por ejemplo con `eas build`).

## Flujo de uso de la app

1. Te registrás con nombre, email y contraseña (o iniciás sesión si ya
   tenés cuenta).
2. Ves el listado de clases del gimnasio (Yoga, Spinning, Crossfit, etc),
   cada una con el cupo disponible.
3. Tocás una clase para ver el detalle y reservarla.
4. En la pestaña "Mis reservas" ves todo lo que reservaste y podés
   cancelar si cambiás de planes.

## Stack utilizado

| Capa      | Tecnología                                                        |
|-----------|---------------------------------------------------------------------|
| Frontend  | Expo (React Native), React Navigation, Axios, AsyncStorage          |
| Backend   | Node.js, Express, JWT (jsonwebtoken), bcryptjs                      |
| Datos     | Archivo JSON local (`backend/data/db.json`), generado automáticamente |

## Por qué está organizado así (para quien está aprendiendo)

- **Separación backend / mobile**: así queda clarísimo qué corre en el
  servidor y qué corre en el celular, y se puede desplegar cada parte por
  separado el día de mañana (por ejemplo, subir el backend a Render y
  dejar la app apuntando ahí).
- **Capa de "base de datos" aislada** (`backend/src/db.js`): los
  controllers nunca leen/escriben el archivo JSON directamente, siempre
  pasan por `readDb()`/`writeDb()`. Si en el futuro migrás a una base de
  datos real, solo tocás ese archivo.
- **Context API en el frontend** (`mobile/src/context/AuthContext.js`):
  para no tener que pasar `user`/`token`/`login`/`logout` a mano por cada
  pantalla.
- **Comentarios en cada archivo**: la idea es que se pueda leer el código
  como si fuera un tutorial guiado.

## Posibles mejoras (para seguir practicando)

- Migrar la base de datos del backend a SQLite/Postgres con un ORM
  (Prisma o Sequelize).
- Agregar recuperación de contraseña.
- Agregar una pantalla de perfil para editar nombre/email.
- Agregar notificaciones push cuando se acerca el horario de una clase
  reservada (con `expo-notifications`).
- Escribir tests del backend con Jest + Supertest.
- Pasar la app a TypeScript.

## Licencia

MIT — usalo libremente para aprender, modificar y compartir.
