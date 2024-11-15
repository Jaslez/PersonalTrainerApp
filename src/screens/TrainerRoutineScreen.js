import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import { db, auth } from '../config/firebaseConfig';
import { doc, collection, addDoc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { colors, globalStyles } from '../styles';

const TrainerRoutineScreen = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newRoutine, setNewRoutine] = useState({ name: '', sets: '', reps: '', duration: '' });

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
    // Fetch routines for selected student
    try {
      const routinesQuery = query(collection(db, 'routines'), where('userID', '==', student.id));
      const snapshot = await getDocs(routinesQuery);
      const routinesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRoutines(routinesData);
    } catch (error) {
      console.error('Error al obtener las rutinas del alumno:', error);
    }
  };

  const handleRoutineSelect = (routine) => {
    setSelectedRoutine(routine);
    setIsModalVisible(true);
  };

  const handleAddRoutine = async () => {
    try {
      const routineRef = await addDoc(collection(db, 'routines'), {
        userID: selectedStudent.id,
        ...newRoutine,
      });
      setRoutines([...routines, { id: routineRef.id, ...newRoutine }]);
      setNewRoutine({ name: '', sets: '', reps: '', duration: '' });
    } catch (error) {
      console.error('Error al agregar la rutina:', error);
    }
  };

  const handleUpdateRoutine = async () => {
    try {
      const routineDoc = doc(db, 'routines', selectedRoutine.id);
      await updateDoc(routineDoc, selectedRoutine);
      setRoutines(routines.map((routine) => (routine.id === selectedRoutine.id ? selectedRoutine : routine)));
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Error al actualizar la rutina:', error);
    }
  };

  const handleDeleteRoutine = async (routineId) => {
    try {
      await deleteDoc(doc(db, 'routines', routineId));
      setRoutines(routines.filter((routine) => routine.id !== routineId));
    } catch (error) {
      console.error('Error al eliminar la rutina:', error);
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
        <View style={styles.routineSection}>
          <Text style={styles.subtitle}>Rutinas de {selectedStudent.name}</Text>
          {routines.map((routine) => (
            <View key={routine.id} style={styles.routineCard}>
              <TouchableOpacity onPress={() => handleRoutineSelect(routine)}>
                <Text style={styles.routineDate}>Fecha: {routine.date}</Text>
                <Text style={styles.routineSummary}>Ejercicios: {routine.exercises?.length || 0}</Text>
              </TouchableOpacity>
              <View style={styles.routineActions}>
                <TouchableOpacity onPress={() => { setSelectedRoutine(routine); setIsEditModalVisible(true); }}>
                  <Icon name="create-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteRoutine(routine.id)}>
                  <Icon name="trash-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View style={styles.addRoutineSection}>
            <Text style={styles.addRoutineTitle}>Añadir Nueva Rutina</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del ejercicio"
              value={newRoutine.name}
              onChangeText={(text) => setNewRoutine((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Series"
              value={newRoutine.sets}
              onChangeText={(text) => setNewRoutine((prev) => ({ ...prev, sets: text }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Repeticiones"
              value={newRoutine.reps}
              onChangeText={(text) => setNewRoutine((prev) => ({ ...prev, reps: text }))}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddRoutine}>
              <Text style={styles.addButtonText}>Agregar Rutina</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal para editar rutina */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Rutina</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del ejercicio"
              value={selectedRoutine?.name}
              onChangeText={(text) => setSelectedRoutine((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Series"
              value={selectedRoutine?.sets}
              onChangeText={(text) => setSelectedRoutine((prev) => ({ ...prev, sets: text }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Repeticiones"
              value={selectedRoutine?.reps}
              onChangeText={(text) => setSelectedRoutine((prev) => ({ ...prev, reps: text }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Duración (si aplica)"
              value={selectedRoutine?.duration}
              onChangeText={(text) => setSelectedRoutine((prev) => ({ ...prev, duration: text }))}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateRoutine}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsEditModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles de la Rutina</Text>
            {selectedRoutine?.exercises?.map((exercise, index) => (
              <View key={index} style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetails}>
                  {exercise.sets ? `${exercise.sets} series de ${exercise.reps} repeticiones` : `Duración: ${exercise.duration}`}
                </Text>
                <TouchableOpacity onPress={() => setSelectedRoutine(exercise)}>
                  <Icon name="play-circle" size={30} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default TrainerRoutineScreen;

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
  routineSection: {
    marginTop: 30,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  routineCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routineDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  routineSummary: {
    fontSize: 16,
    color: colors.placeholder,
  },
  routineActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addRoutineSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
  },
  addRoutineTitle: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  exerciseCard: {
    marginBottom: 15,
  },
  exerciseName: {
    fontSize: 18,
    color: colors.primary,
  },
  exerciseDetails: {
    fontSize: 16,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
