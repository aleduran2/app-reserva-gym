/**
 * components/ClassCard.js
 * --------------------------------------------------------------------------
 * Tarjeta que muestra el resumen de una clase dentro de un FlatList.
 * Es un componente "tonto" (presentacional): solo recibe datos por props
 * y dispara `onPress` cuando lo tocan. No sabe nada de la API ni de
 * navegación, eso lo maneja quien lo usa.
 * --------------------------------------------------------------------------
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function ClassCard({ clase, onPress }) {
  const sinCupo = clase.cupoDisponible <= 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.nombre}>{clase.nombre}</Text>
        <View style={[styles.badge, sinCupo && styles.badgeLleno]}>
          <Text style={styles.badgeText}>
            {sinCupo ? 'Sin cupo' : `${clase.cupoDisponible} lugares`}
          </Text>
        </View>
      </View>

      <Text style={styles.detalle}>
        {clase.dia} · {clase.hora} · {clase.duracionMinutos} min
      </Text>
      <Text style={styles.instructor}>Instructor/a: {clase.instructor}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nombre: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: colors.primaryDark,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeLleno: {
    backgroundColor: colors.danger,
  },
  badgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '700',
  },
  detalle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 2,
  },
  instructor: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
