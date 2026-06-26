/**
 * App.js
 * --------------------------------------------------------------------------
 * Punto de entrada de la app. Envuelve todo en los providers necesarios:
 *
 *  - SafeAreaProvider: respeta los "notch"/bordes redondeados del celular.
 *  - AuthProvider: expone el estado de sesión (user, token, login, logout)
 *    a toda la app vía Context API.
 *  - AppNavigator: decide qué pantallas mostrar según haya o no sesión.
 * --------------------------------------------------------------------------
 */

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
