import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import { db, auth } from '../config/firebaseConfig';
import { doc, collection, addDoc } from 'firebase/firestore';
import { colors, globalStyles } from '../styles';

const RoutineScreen = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [completedExercises, setCompletedExercises] = useState({});
  const [exerciseNotes, setExerciseNotes] = useState({});
  const [routineDate, setRoutineDate] = useState(new Date().toLocaleDateString()); // Formato dia/mes/año

  const exercises = [
    { id: 1, name: 'Sentadillas', sets: 3, reps: 15, videoUrl: 'https://example.com/videos/squats.mp4' },
    { id: 2, name: 'Flexiones', sets: 3, reps: 12, videoUrl: 'https://example.com/videos/pushups.mp4' },
    { id: 3, name: 'Plancha', duration: '1 min', videoUrl: 'https://example.com/videos/plank.mp4' },
  ];

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setIsModalVisible(true);
  };

  const toggleCompleted = (exerciseId) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleSaveRoutineProgress = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const routineRef = await addDoc(collection(db, 'routines'), {
          userID: user.uid,
          date: routineDate,
          exercises: exercises.map((ex) => ({
            ...ex,
            completed: completedExercises[ex.id] || false,
            note: exerciseNotes[ex.id] || '',
          })),
        });
        console.log('Rutina guardada con ID:', routineRef.id);
      } catch (error) {
        console.error('Error al guardar la rutina:', error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Rutina de Hoy</Text>
      {exercises.map((exercise) => (
        <View key={exercise.id} style={styles.exerciseCard}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDetails}>
              {exercise.sets ? `${exercise.sets} series de ${exercise.reps} repeticiones` : `Duración: ${exercise.duration}`}
            </Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => handleExerciseSelect(exercise)} style={styles.iconButton}>
                <Icon name="play-circle" size={28} color={colors.primary} />
                <Text style={styles.iconText}>Ver</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleCompleted(exercise.id)} style={styles.iconButton}>
                <Icon name={completedExercises[exercise.id] ? "checkbox" : "square-outline"} size={28} color={colors.primary} />
                <Text style={styles.iconText}>Completado</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="Añadir una nota..."
              placeholderTextColor="#ccc"
              value={exerciseNotes[exercise.id] || ''}
              onChangeText={(text) => setExerciseNotes((prev) => ({ ...prev, [exercise.id]: text }))}
            />
          </View>
        </View>
      ))}
      
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
            <Video
              source={{ uri: selectedExercise?.videoUrl }}
              style={styles.video}
              controls={true}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <TouchableOpacity onPress={handleSaveRoutineProgress} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar Progreso de la Rutina</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    ...globalStyles.title,
    fontSize: 24,
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  exerciseCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  exerciseInfo: {
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  exerciseDetails: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  iconText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 5,
  },
  noteInput: {
    backgroundColor: '#F0F0F0',
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    color: colors.text,
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
  video: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RoutineScreen;
