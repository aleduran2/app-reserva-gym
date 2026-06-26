# Mobile — App de Reservas del Gimnasio (Expo / React Native)

App hecha con **Expo (React Native)**. Tiene login/registro y permite ver
las clases del gimnasio, reservarlas y cancelarlas. Pensada como proyecto
para **aprender React Native** paso a paso: cada archivo tiene comentarios
explicando qué hace y por qué.

## Requisitos

- Node.js 18+
- La app **Expo Go** instalada en tu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)) — la forma más rápida de probar la app mientras desarrollás, sin compilar nada.
- El backend corriendo (ver `../backend/README.md`).

## Instalación

```bash
cd mobile
npm install
```

Después de instalar, alineá las versiones de todas las librerías con la
versión de Expo que estés usando (esto evita 80% de los problemas raros):

```bash
npx expo install --fix
```

## ⚠️ Configurar la URL del backend (paso obligatorio)

Abrí `src/api/client.js` y editá la constante `API_URL` según cómo vayas a
probar la app. El archivo tiene un comentario explicando cada caso
(emulador Android, simulador iOS, celular físico, APK ya instalado, etc).
Por defecto está configurado para **emulador de Android** (`10.0.2.2`).

Si vas a probar en tu celular físico con Expo Go, necesitás:
1. Que el celular y tu computadora estén en la misma red Wi-Fi.
2. Tu IP local (en Windows: `ipconfig`, en Mac/Linux: `ifconfig` o `ip a`).
3. Poner esa IP en `API_URL`, por ejemplo: `http://192.168.0.15:4000/api`.

## Ejecutar en desarrollo

```bash
npx expo start
```

Esto abre el "Metro Bundler" en la terminal y muestra un código QR.

- **Celular físico:** abrí la app Expo Go y escaneá el QR (Android) o
  usá la cámara nativa (iOS).
- **Emulador Android:** con el emulador ya abierto, apretá `a` en la
  terminal donde corre `expo start`.
- **Simulador iOS (solo Mac):** apretá `i`.

Recordá tener el backend corriendo en paralelo (`npm run dev` dentro de
`backend/`), si no la app no va a poder cargar las clases.

## Estructura del código

```
mobile/
├── App.js                       # Punto de entrada, providers globales
└── src/
    ├── api/client.js             # Configuración de axios + URL del backend
    ├── context/AuthContext.js    # Estado global de sesión (login/logout)
    ├── navigation/AppNavigator.js# Stacks y tabs de la app
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── ClassesScreen.js       # Listado de clases
    │   ├── ClassDetailScreen.js   # Detalle + botón de reservar
    │   └── ReservationsScreen.js  # Mis reservas + cancelar
    ├── components/ClassCard.js   # Tarjeta reutilizable de una clase
    └── theme/colors.js           # Paleta de colores de la app
```

## Conceptos de React Native que vas a ver acá (para estudiar)

| Concepto                         | Dónde está                                  |
|-----------------------------------|----------------------------------------------|
| Componentes funcionales + hooks  | Todas las pantallas                          |
| `useState` / `useEffect`         | Casi todos los archivos                      |
| Context API (estado global)      | `context/AuthContext.js`                     |
| Navegación (stack + tabs)        | `navigation/AppNavigator.js`                 |
| `FlatList` (listas eficientes)   | `ClassesScreen.js`, `ReservationsScreen.js`  |
| Formularios controlados          | `LoginScreen.js`, `RegisterScreen.js`        |
| Llamadas HTTP con axios          | `api/client.js` y dentro de cada pantalla    |
| Almacenamiento persistente       | `AsyncStorage` en `AuthContext.js`           |
| `useFocusEffect`                 | `ReservationsScreen.js`                      |
| Manejo de errores de red         | `getErrorMessage` en `api/client.js`         |

Una buena forma de aprender: abrí cada pantalla en este orden —
`LoginScreen` → `AuthContext` → `AppNavigator` → `ClassesScreen` →
`ClassDetailScreen` → `ReservationsScreen` — y leé los comentarios.

## Generar el APK para compartir

Mirá la guía completa en [`../docs/APK_GUIDE.md`](../docs/APK_GUIDE.md).
Resumen rápido (usando EAS Build, la forma recomendada por Expo):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

Al terminar, el comando te da un link para descargar el `.apk` y
compartirlo (WhatsApp, Drive, etc).
