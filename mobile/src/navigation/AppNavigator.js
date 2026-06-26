/**
 * navigation/AppNavigator.js
 * --------------------------------------------------------------------------
 * Define toda la navegación de la app:
 *
 *  - Si NO hay sesión iniciada -> Stack de autenticación (Login/Register).
 *  - Si HAY sesión iniciada    -> Tabs principales (Clases / Mis Reservas),
 *    y dentro del tab de Clases hay además un Stack para poder entrar al
 *    detalle de una clase.
 *
 * Este patrón ("auth flow" condicional) es muy común en apps reales: el
 * AuthContext decide qué mostrar, el navigator no tiene que "saber" cómo
 * se logueó el usuario.
 * --------------------------------------------------------------------------
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ClassesScreen from '../screens/ClassesScreen';
import ClassDetailScreen from '../screens/ClassDetailScreen';
import ReservationsScreen from '../screens/ReservationsScreen';

const AuthStack = createNativeStackNavigator();
const ClassesStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  contentStyle: { backgroundColor: colors.background },
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={screenOptions}>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Crear cuenta' }}
      />
    </AuthStack.Navigator>
  );
}

function ClassesNavigator() {
  return (
    <ClassesStack.Navigator screenOptions={screenOptions}>
      <ClassesStack.Screen
        name="ClassesList"
        component={ClassesScreen}
        options={{ title: 'Clases' }}
      />
      <ClassesStack.Screen
        name="ClassDetail"
        component={ClassDetailScreen}
        options={{ title: 'Detalle de la clase' }}
      />
    </ClassesStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        ...screenOptions,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="Classes"
        component={ClassesNavigator}
        options={{ headerShown: false, title: 'Clases' }}
      />
      <Tabs.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{ title: 'Mis reservas' }}
      />
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  // Mientras se restaura la sesión guardada (AsyncStorage), mostramos un
  // loader simple en vez de la pantalla de login parpadeando de entrada.
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
