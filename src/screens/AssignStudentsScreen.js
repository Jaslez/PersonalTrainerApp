import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const AssignStudentsScreen = () => {
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  // Cargar los entrenadores y alumnos
  useEffect(() => {
    const fetchTrainersAndStudents = async () => {
      try {
        const trainersSnapshot = await getDocs(collection(db, 'trainers'));
        const studentsSnapshot = await getDocs(collection(db, 'students'));

        setTrainers(trainersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setStudents(studentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error al obtener entrenadores o alumnos:', error);
      }
    };

    fetchTrainersAndStudents();
  }, []);

  // Función para asignar un alumno a un entrenador seleccionado
  const handleAssignStudent = async (studentId) => {
    if (selectedTrainer) {
      try {
        const studentDocRef = doc(db, 'students', studentId);
        await updateDoc(studentDocRef, {
          trainerId: selectedTrainer.id,
        });
        alert(`Alumno asignado al entrenador ${selectedTrainer.name}`);
      } catch (error) {
        console.error('Error al asignar el alumno al entrenador:', error);
        alert('Error al asignar al alumno, inténtalo de nuevo.');
      }
    } else {
      alert('Por favor selecciona un entrenador primero.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asignar Alumnos a Entrenadores</Text>

      <Text style={styles.subtitle}>Selecciona un Entrenador:</Text>
      <FlatList
        data={trainers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.trainerCard,
              selectedTrainer?.id === item.id && styles.selectedTrainerCard,
            ]}
            onPress={() => setSelectedTrainer(item)}
          >
            <Text style={styles.trainerName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.subtitle}>Lista de Alumnos:</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studentCard}
            onPress={() => handleAssignStudent(item.id)}
          >
            <Text style={styles.studentName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AssignStudentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  trainerCard: {
    padding: 15,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
    borderRadius: 8,
  },
  selectedTrainerCard: {
    backgroundColor: '#cce5ff',
  },
  trainerName: {
    fontSize: 16,
  },
  studentCard: {
    padding: 15,
    backgroundColor: '#e6e6e6',
    marginBottom: 10,
    borderRadius: 8,
  },
  studentName: {
    fontSize: 16,
  },
});
