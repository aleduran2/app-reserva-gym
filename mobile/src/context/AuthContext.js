/**
 * context/AuthContext.js
 * --------------------------------------------------------------------------
 * Maneja el estado de autenticación de toda la app usando la Context API
 * de React. Esto evita tener que pasar `user`, `token`, `login`, `logout`
 * manualmente por props a través de muchos componentes ("prop drilling").
 *
 * Conceptos de React/React Native que se usan acá:
 *  - createContext / useContext: para compartir estado global.
 *  - useState: para guardar user/token/loading en memoria.
 *  - useEffect: para restaurar la sesión guardada al abrir la app.
 *  - AsyncStorage: almacenamiento persistente tipo "localStorage" pero
 *    para apps móviles (sobrevive a que cierres la app).
 * --------------------------------------------------------------------------
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setAuthToken, getErrorMessage } from '../api/client';

const STORAGE_KEY = '@reservas-gym/session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // `loading` = todavía estamos chequeando si había una sesión guardada.
  const [loading, setLoading] = useState(true);

  // Al montar la app por primera vez, intentamos restaurar la sesión
  // guardada en el dispositivo (si el usuario ya se había logueado antes).
  useEffect(() => {
    async function restoreSession() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const session = JSON.parse(raw);
          setUser(session.user);
          setToken(session.token);
          setAuthToken(session.token);
        }
      } catch (err) {
        console.warn('No se pudo restaurar la sesión guardada', err);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function persistSession(nextUser, nextToken) {
    setUser(nextUser);
    setToken(nextToken);
    setAuthToken(nextToken);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: nextUser, token: nextToken })
    );
  }

  async function login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await persistSession(data.user, data.token);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: getErrorMessage(err) };
    }
  }

  async function register(nombre, email, password) {
    try {
      const { data } = await api.post('/auth/register', { nombre, email, password });
      await persistSession(data.user, data.token);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: getErrorMessage(err) };
    }
  }

  async function logout() {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook para consumir el contexto de autenticación desde cualquier pantalla. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return context;
}
