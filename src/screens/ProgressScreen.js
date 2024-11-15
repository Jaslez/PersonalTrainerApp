import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart, ProgressChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import { colors } from '../styles';
import { Calendar } from 'react-native-calendars';

const screenWidth = Dimensions.get('window').width;

const ProgressScreen = () => {
  const [weeklyProgress, setWeeklyProgress] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [monthlyGoals, setMonthlyGoals] = useState([0, 0, 0]);
  const [routineComparison, setRoutineComparison] = useState([0, 0, 0, 0]);
  const [completedDates, setCompletedDates] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const unsubscribe = onSnapshot(
        doc(db, 'progress', user.uid),
        (progressDoc) => {
          if (progressDoc.exists()) {
            const data = progressDoc.data();

            // Validación y configuración de datos
            setWeeklyProgress(Array.isArray(data.weeklyProgress) ? data.weeklyProgress : [0, 0, 0, 0, 0, 0, 0]);
            setMonthlyGoals(Array.isArray(data.monthlyGoals) ? data.monthlyGoals : [0, 0, 0]);
            setRoutineComparison(Array.isArray(data.routineComparison) ? data.routineComparison : [0, 0, 0, 0]);

            // Formato del calendario
            const formattedCompletedDates = Object.fromEntries(
              Object.entries(data.completedDates || {}).map(([key, value]) => [
                key,
                { marked: value?.marked || false },
              ])
            );
            setCompletedDates(formattedCompletedDates);
          } else {
            setError('No se encontraron datos de progreso.');
          }
        },
        (err) => setError(`Error al obtener datos: ${err.message}`)
      );

      return unsubscribe;
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          {/* Calendario de días con rutinas completadas */}
          <View style={styles.calendarContainer}>
            <Text style={styles.chartTitle}>Calendario de Rutinas</Text>
            <Calendar
              markedDates={completedDates}
              theme={{
                selectedDayBackgroundColor: colors.primary,
                todayTextColor: colors.secondary,
                arrowColor: colors.primary,
              }}
            />
          </View>

          {/* Gráfico de Línea para el Progreso Semanal */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Progreso de Ejercicio Semanal</Text>
            <LineChart
              data={{
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{ data: weeklyProgress }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundGradientFrom: colors.cardBackground,
                backgroundGradientTo: colors.primary,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{ borderRadius: 10 }}
            />
          </View>

          {/* Gráfico Circular para los Objetivos Mensuales */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Cumplimiento de Objetivos Mensuales</Text>
            <ProgressChart
              data={{
                labels: ['Cardio', 'Fuerza', 'Flexibilidad'],
                data: monthlyGoals,
              }}
              width={screenWidth - 40}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={{
                backgroundGradientFrom: colors.cardBackground,
                backgroundGradientTo: colors.primary,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{ borderRadius: 10 }}
            />
          </View>

          {/* Gráfico de Barras para Comparación de Progreso Semanal */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Comparación de Progreso Semanal</Text>
            <BarChart
              data={{
                labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                datasets: [{ data: routineComparison }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundGradientFrom: colors.cardBackground,
                backgroundGradientTo: colors.primary,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{ borderRadius: 10 }}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  calendarContainer: { marginBottom: 20 },
  chartContainer: { marginBottom: 20 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 10, textAlign: 'center' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginVertical: 20 },
});

export default ProgressScreen;
