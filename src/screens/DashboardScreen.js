// src/screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { globalStyles, colors } from '../styles';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Hola, {userName}!</Text>
        <Image
          source={require('../../assets/avatar_fitness.png')}
          style={styles.profileImage}
        />
      </View>

      {/* Resto del contenido del Dashboard, como gráficos y tarjetas */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Progreso de Ejercicio Semanal</Text>
        <LineChart
          data={{
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{ data: [20, 45, 28, 80, 99, 43, 50] }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.cardBackground,
            backgroundGradientTo: colors.primary,
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 10 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: colors.primary },
          }}
          bezier
          style={{ marginVertical: 20, borderRadius: 10 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  headerText: {
    ...globalStyles.title,
    fontSize: 24,
    color: colors.primary,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default DashboardScreen;
