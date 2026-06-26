/**
 * screens/ClassesScreen.js
 * --------------------------------------------------------------------------
 * Lista todas las clases del gimnasio, traídas desde GET /api/classes.
 *
 * Conceptos de React Native usados acá:
 *  - useEffect para disparar el fetch cuando se monta la pantalla.
 *  - useState para guardar la lista, el loading y posibles errores.
 *  - FlatList para renderizar listas largas de forma eficiente
 *    (en vez de un .map() dentro de un ScrollView).
 *  - RefreshControl para el "pull to refresh" (deslizar hacia abajo
 *    para recargar).
 * --------------------------------------------------------------------------
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api, getErrorMessage } from '../api/client';
import ClassCard from '../components/ClassCard';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function ClassesScreen({ navigation }) {
  const { logout, user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchClasses = useCallback(async () => {
    try {
      setError('');
      const { data } = await api.get('/classes');
      setClasses(data.classes);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    fetchClasses().finally(() => setLoading(false));
  }, [fetchClasses]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchClasses();
    setRefreshing(false);
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
      <View style={styles.header}>
        <Text style={styles.saludo}>Hola, {user?.nombre} 👋</Text>
        <Pressable onPress={logout}>
          <Text style={styles.logout}>Cerrar sesión</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay clases cargadas todavía.</Text>
        }
        renderItem={({ item }) => (
          <ClassCard
            clase={item}
            onPress={() => navigation.navigate('ClassDetail', { classId: item.id })}
          />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  saludo: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  logout: {
    color: colors.danger,
    fontWeight: '600',
  },
  lista: {
    paddingBottom: 24,
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
