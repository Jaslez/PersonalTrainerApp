import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { colors, globalStyles } from '../styles';

const TrainerStudentDetailsScreen = ({ route }) => {
  const { studentId, studentName } = route.params;
  const [progressData, setProgressData] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const studentDoc = await getDocs(query(collection(db, 'students'), where('id', '==', studentId)));
        if (!studentDoc.empty) {
          setStudentDetails({ id: studentDoc.docs[0].id, ...studentDoc.docs[0].data() });
        }
      } catch (error) {
        console.error('Error al obtener los detalles del alumno:', error);
      }
    };

    const fetchProgressData = async () => {
      try {
        const progressQuery = query(collection(db, 'progress'), where('userID', '==', studentId));
        const snapshot = await getDocs(progressQuery);
        const progress = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProgressData(progress);
      } catch (error) {
        console.error('Error al obtener los datos de progreso:', error);
      }
    };

    fetchStudentDetails();
    fetchProgressData();
  }, [studentId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles del Alumno</Text>
      {studentDetails ? (
        <View style={styles.studentDetailsSection}>
          <Text style={styles.detailText}><Text style={styles.bold}>Nombre: </Text>{studentDetails.name}</Text>
          <Text style={styles.detailText}><Text style={styles.bold}>Edad: </Text>{studentDetails.age}</Text>
          <Text style={styles.detailText}><Text style={styles.bold}>Género: </Text>{studentDetails.gender}</Text>
          <Text style={styles.detailText}><Text style={styles.bold}>Correo: </Text>{studentDetails.email}</Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Cargando información del alumno...</Text>
      )}

      <View style={styles.progressSection}>
        <Text style={styles.subtitle}>Progreso del Alumno</Text>
        {progressData.length > 0 ? (
          progressData.map((progress) => (
            <View key={progress.id} style={styles.progressCard}>
              <Text style={styles.progressDate}>Fecha: {progress.date}</Text>
              <Text style={styles.progressDetail}>Rutinas completadas: {progress.completedRoutines}</Text>
              <Text style={styles.progressDetail}>Notas: {progress.notes}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noProgressText}>No hay datos de progreso disponibles.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default TrainerStudentDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    ...globalStyles.title,
    fontSize: 24,
    color: colors.primary,
    marginBottom: 20,
  },
  studentDetailsSection: {
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    color: colors.placeholder,
    textAlign: 'center',
    marginVertical: 20,
  },
  progressSection: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  progressCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  progressDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  progressDetail: {
    fontSize: 16,
    color: colors.text,
    marginTop: 5,
  },
  noProgressText: {
    fontSize: 16,
    color: colors.placeholder,
    textAlign: 'center',
  },
});
