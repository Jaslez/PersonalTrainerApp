import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { colors, globalStyles } from '../styles';

const TrainerInjuryScreen = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [injuries, setInjuries] = useState([]);
  const [newInjury, setNewInjury] = useState({ name: '', description: '' });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const trainerId = auth.currentUser?.uid;
        const studentsQuery = query(collection(db, 'students'), where('trainerID', '==', trainerId));
        const snapshot = await getDocs(studentsQuery);
        const studentsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStudents(studentsData);
      } catch (error) {
        console.error('Error al obtener los alumnos:', error);
      }
    };
    fetchStudents();
  }, []);

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    // Fetch injuries for selected student
    try {
      const injuriesQuery = query(collection(db, 'injuries'), where('userID', '==', student.id));
      const snapshot = await getDocs(injuriesQuery);
      const injuriesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInjuries(injuriesData);
    } catch (error) {
      console.error('Error al obtener las lesiones del alumno:', error);
    }
  };

  const handleAddInjury = async () => {
    if (newInjury.name.trim() && newInjury.description.trim()) {
      try {
        const injuryRef = await addDoc(collection(db, 'injuries'), {
          userID: selectedStudent.id,
          ...newInjury,
          date: new Date().toLocaleDateString(),
        });
        setInjuries([...injuries, { id: injuryRef.id, ...newInjury }]);
        setNewInjury({ name: '', description: '' });
      } catch (error) {
        console.error('Error al agregar la lesión:', error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Alumnos Asignados</Text>
      {students.length === 0 ? (
        <Text style={styles.noStudentsText}>No hay alumnos asignados aún.</Text>
      ) : (
        students.map((student) => (
          <TouchableOpacity
            key={student.id}
            style={styles.studentCard}
            onPress={() => handleStudentSelect(student)}
          >
            <Text style={styles.studentName}>{student.name}</Text>
            <Icon name="chevron-forward-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        ))
      )}

      {selectedStudent && (
        <View style={styles.injurySection}>
          <Text style={styles.subtitle}>Lesiones de {selectedStudent.name}</Text>
          {injuries.map((injury) => (
            <View key={injury.id} style={styles.injuryCard}>
              <Text style={styles.injuryName}>{injury.name}</Text>
              <Text style={styles.injuryDescription}>{injury.description}</Text>
              <Text style={styles.injuryDate}>Fecha: {injury.date}</Text>
            </View>
          ))}
          <View style={styles.addInjurySection}>
            <Text style={styles.addInjuryTitle}>Añadir Nueva Lesión</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la lesión"
              value={newInjury.name}
              onChangeText={(text) => setNewInjury((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción de la lesión"
              value={newInjury.description}
              onChangeText={(text) => setNewInjury((prev) => ({ ...prev, description: text }))}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddInjury}>
              <Text style={styles.addButtonText}>Agregar Lesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default TrainerInjuryScreen;

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
  studentCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  injurySection: {
    marginTop: 30,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  injuryCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  injuryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  injuryDescription: {
    fontSize: 16,
    color: colors.text,
  },
  injuryDate: {
    fontSize: 14,
    color: colors.placeholder,
  },
  addInjurySection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
  },
  addInjuryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.placeholder,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noStudentsText: {
    fontSize: 16,
    color: colors.placeholder,
    textAlign: 'center',
    marginVertical: 20,
  },
});
