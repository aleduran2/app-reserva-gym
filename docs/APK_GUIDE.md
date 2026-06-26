# Guía: cómo generar el APK para descargar y compartir

Hay dos caminos. El recomendado (y más simple) es **EAS Build**, el
servicio en la nube de Expo. También se explica la alternativa 100% local
con Android Studio, por si no querés depender de un servicio externo.

---

## Opción A (recomendada): EAS Build — build en la nube de Expo

No necesitás instalar Android Studio ni el SDK de Android en tu máquina.
Expo compila el APK en sus servidores y te da un link de descarga.

### 1. Crear una cuenta gratuita de Expo

Entrá a https://expo.dev/signup (o registrate directamente desde la
terminal en el paso siguiente).

### 2. Instalar la CLI de EAS

```bash
npm install -g eas-cli
```

### 3. Iniciar sesión

```bash
eas login
```

### 4. Configurar el proyecto para EAS (solo la primera vez)

Desde la carpeta `mobile/`:

```bash
cd mobile
eas build:configure
```

Esto va a:
- Crear un proyecto de Expo asociado a tu cuenta.
- Completar el `projectId` real en `app.json` (reemplazando el
  placeholder `REEMPLAZAR-CON-TU-PROJECT-ID` que dejamos en el archivo).

El repo ya incluye un `eas.json` con un perfil **`preview`** configurado
para generar directamente un `.apk` (en vez de un `.aab`, que es el
formato que pide la Play Store pero que no se puede instalar a mano).

### 5. Lanzar el build

```bash
eas build -p android --profile preview
```

La primera vez te va a preguntar si querés que Expo genere un keystore de
Android por vos. Decí que sí (`Yes`) — es lo más simple para empezar; EAS
lo guarda de forma segura y lo reutiliza en los próximos builds.

El build corre en los servidores de Expo y tarda entre ~5 y ~15 minutos
según la cola. Vas a ver el progreso en la terminal, con un link a un
dashboard web donde también podés seguirlo.

### 6. Descargar y compartir el APK

Cuando termina, la terminal (y el dashboard) te muestran un link directo
de descarga del `.apk`. Podés:

- Abrir ese link desde el celular Android directamente y descargarlo.
- O descargarlo en tu PC y compartirlo por WhatsApp, Drive, Telegram, etc.

### 7. Instalarlo en un Android

Como no viene de Google Play, Android va a pedir permiso para "instalar
apps de orígenes desconocidos" la primera vez. Es normal: aceptás ese
permiso (solo para esa instalación) y listo.

> 💡 **Importante sobre la URL del backend en el APK**: una vez compilado,
> la app va a usar la URL que hayas puesto en `src/api/client.js` en el
> momento del build. `http://10.0.2.2:4000` o una IP local de tu Wi-Fi
> **no van a funcionar** en el celular de otra persona. Para que el APK
> funcione fuera de tu red, necesitás desplegar el backend en un servicio
> con URL pública (por ejemplo Render, Railway o Fly.io) y poner esa URL
> en `API_URL` antes de correr `eas build`.

---

## Opción B: build 100% local (sin depender de EAS)

Requiere tener instalado Android Studio + el SDK de Android + un JDK en
tu computadora. Es más trabajo de configurar, pero no depende de ningún
servicio externo y no necesita cuenta de Expo.

### 1. Generar los proyectos nativos

Desde `mobile/`:

```bash
npx expo prebuild --platform android
```

Esto genera una carpeta `android/` con un proyecto nativo de Android
normal (Gradle).

### 2. Compilar el APK con Gradle

```bash
cd android
./gradlew assembleRelease
```

(En Windows usá `gradlew.bat assembleRelease`)

### 3. Encontrar el APK generado

Va a quedar en:

```
mobile/android/app/build/outputs/apk/release/app-release.apk
```

Ese archivo ya lo podés compartir igual que en la Opción A.

> Nota: para una build de "release" firmada correctamente (no solo de
> debug) vas a necesitar generar un keystore propio y configurarlo en
> `android/app/build.gradle`. La documentación oficial de Android explica
> el proceso: https://developer.android.com/studio/publish/app-signing

---

## ¿Cuál conviene usar?

- **Estás aprendiendo / querés algo rápido para mandarle a un amigo:**
  Opción A (EAS Build). Es la que recomienda oficialmente Expo y no
  requiere instalar nada de Android Studio.
- **Querés control total y no depender de servicios externos:**
  Opción B (build local), aceptando la complejidad extra de configurar
  el entorno nativo de Android.
