/**
 * screens/ClassDetailScreen.js
 * --------------------------------------------------------------------------
 * Muestra el detalle de una clase y permite reservarla.
 * Recibe el `classId` por parámetro de navegación (route.params).
 * --------------------------------------------------------------------------
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api, getErrorMessage } from '../api/client';
import { colors } from '../theme/colors';

export default function ClassDetailScreen({ route, navigation }) {
  const { classId } = route.params;
  const [clase, setClase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservando, setReservando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    async function fetchClase() {
      try {
        const { data } = await api.get(`/classes/${classId}`);
        if (activo) setClase(data.class);
      } catch (err) {
        if (activo) setError(getErrorMessage(err));
      } finally {
        if (activo) setLoading(false);
      }
    }
    fetchClase();
    return () => {
      activo = false; // evita actualizar el estado si la pantalla se desmontó
    };
  }, [classId]);

  async function handleReservar() {
    setReservando(true);
    try {
      await api.post('/reservations', { classId });
      Alert.alert('¡Listo!', 'Tu reserva fue confirmada.', [
        { text: 'Ver mis reservas', onPress: () => navigation.navigate('Reservations') },
      ]);
    } catch (err) {
      Alert.alert('No se pudo reservar', getErrorMessage(err));
    } finally {
      setReservando(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error || !clase) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'No se encontró la clase.'}</Text>
      </View>
    );
  }

  const sinCupo = clase.cupoDisponible <= 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.nombre}>{clase.nombre}</Text>
      <Text style={styles.detalle}>
        {clase.dia} · {clase.hora} · {clase.duracionMinutos} minutos
      </Text>
      <Text style={styles.detalle}>Instructor/a: {clase.instructor}</Text>
      <Text style={styles.descripcion}>{clase.descripcion}</Text>

      <View style={styles.cupoBox}>
        <Text style={styles.cupoTexto}>
          {sinCupo
            ? 'No quedan lugares disponibles'
            : `Quedan ${clase.cupoDisponible} de ${clase.cupo} lugares`}
        </Text>
      </View>

      <Pressable
        style={[styles.button, sinCupo && styles.buttonDisabled]}
        onPress={handleReservar}
        disabled={sinCupo || reservando}
      >
        {reservando ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={styles.buttonText}>
            {sinCupo ? 'Sin cupo disponible' : 'Reservar clase'}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  nombre: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  detalle: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: 4,
  },
  descripcion: {
    color: colors.text,
    fontSize: 15,
    marginTop: 16,
    lineHeight: 22,
  },
  cupoBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cupoTexto: {
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  buttonText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 16,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
  },
});
