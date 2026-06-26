/**
 * api/client.js
 * --------------------------------------------------------------------------
 * Acá vive la configuración de axios para hablar con nuestro backend.
 *
 * MUY IMPORTANTE — cómo elegir la URL correcta de la API:
 *
 *  - Emulador de Android (Android Studio):
 *      usar  http://10.0.2.2:4000   (10.0.2.2 es un alias especial que
 *      apunta a "localhost" de tu computadora, visto desde el emulador)
 *
 *  - Simulador de iOS (Mac):
 *      usar  http://localhost:4000  (el simulador de iOS sí puede usar
 *      localhost directamente)
 *
 *  - Celular físico con la app Expo Go (en la misma red Wi-Fi que tu PC):
 *      usar  http://TU_IP_LOCAL:4000  (por ejemplo http://192.168.0.15:4000)
 *      Para ver tu IP local: en Windows `ipconfig`, en Mac/Linux `ifconfig`
 *      o `ip a`. Asegurate de que el celular y la PC estén en la MISMA red.
 *
 *  - APK ya instalado (build de EAS) probando contra un backend desplegado
 *    en internet (Render, Railway, etc.):
 *      usar  https://tu-backend-en-la-nube.com
 *
 * Cambiá el valor de API_URL más abajo según el caso en el que estés.
 * --------------------------------------------------------------------------
 */

import axios from 'axios';

// 👇 Cambiá esta URL según donde estés probando la app (ver comentario arriba).
export const API_URL = 'http://10.0.2.2:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

/**
 * Configura (o quita) el header Authorization en todas las próximas
 * peticiones de este cliente axios. Se llama desde AuthContext cada vez
 * que el usuario inicia o cierra sesión.
 */
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/**
 * Pequeño helper para sacar un mensaje de error legible de una respuesta
 * de axios, ya sea que venga de nuestra API (err.response.data.error) o
 * de un problema de red (sin respuesta del servidor).
 */
export function getErrorMessage(error) {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message === 'Network Error') {
    return 'No se pudo conectar con el servidor. Revisá que el backend esté corriendo y que API_URL sea correcta.';
  }
  return 'Ocurrió un error inesperado. Intentá de nuevo.';
}
