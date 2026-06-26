/**
 * screens/ReservationsScreen.js
 * --------------------------------------------------------------------------
 * Lista las reservas del usuario logueado (GET /api/reservations/me) y
 * permite cancelarlas (DELETE /api/reservations/:id).
 *
 * Usamos `useFocusEffect` de React Navigation en vez de `useEffect` simple,
 * para que la lista se recargue automáticamente cada vez que el usuario
 * vuelve a esta pantalla (por ejemplo, después de reservar una clase nueva).
 * --------------------------------------------------------------------------
 */

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api, getErrorMessage } from '../api/client';
import { colors } from '../theme/colors';

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelandoId, setCancelandoId] = useState(null);

  const fetchReservations = useCallback(async () => {
    try {
      setError('');
      const { data } = await api.get('/reservations/me');
      setReservations(data.reservations);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // useFocusEffect se ejecuta cada vez que esta pantalla vuelve a estar
  // visible (por ejemplo al cambiar de tab), no solo la primera vez.
  useFocusEffect(
    useCallback(() => {
      fetchReservations();
    }, [fetchReservations])
  );

  function confirmarCancelacion(reserva) {
    Alert.alert(
      'Cancelar reserva',
      `¿Seguro que querés cancelar tu reserva de ${reserva.class?.nombre}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí, cancelar', style: 'destructive', onPress: () => cancelar(reserva.id) },
      ]
    );
  }

  async function cancelar(id) {
    setCancelandoId(id);
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      Alert.alert('No se pudo cancelar', getErrorMessage(err));
    } finally {
      setCancelandoId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vacio}>Todavía no tenés reservas. ¡Reservá una clase!</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.class?.nombre ?? 'Clase eliminada'}</Text>
            {item.class ? (
              <Text style={styles.detalle}>
                {item.class.dia} · {item.class.hora}
              </Text>
            ) : null}

            <Pressable
              style={styles.cancelButton}
              onPress={() => confirmarCancelacion(item)}
              disabled={cancelandoId === item.id}
            >
              {cancelandoId === item.id ? (
                <ActivityIndicator color={colors.danger} />
              ) : (
                <Text style={styles.cancelText}>Cancelar reserva</Text>
              )}
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lista: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nombre: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  detalle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 12,
  },
  cancelButton: {
    alignSelf: 'flex-start',
  },
  cancelText: {
    color: colors.danger,
    fontWeight: '600',
  },
  vacio: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
  error: {
    color: colors.danger,
    marginBottom: 12,
    textAlign: 'center',
  },
});
