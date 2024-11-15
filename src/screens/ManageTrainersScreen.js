import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { db, auth } from '../config/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { colors, globalStyles } from '../styles';
import AdminDashboardScreen from './AdminDashboardScreen';


// Manage Trainers Screen
const ManageTrainersScreen = () => {
  const [trainers, setTrainers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTrainer, setNewTrainer] = useState({ name: '', email: '', password: '', age: '', phone: '', specialty: '', availability: '' });

  useEffect(() => {
    const fetchTrainers = () => {
      try {
        const unsubscribe = onSnapshot(collection(db, 'trainers'), (snapshot) => {
          const trainersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setTrainers(trainersData);
        });
  
        // Cleanup function to unsubscribe from listener
        return () => unsubscribe();
      } catch (error) {
        console.error('Error al obtener los entrenadores:', error);
      }
    };
    fetchTrainers();
  }, []);
  const handleAddTrainer = async () => {
    if (
      newTrainer.name.trim() &&
      newTrainer.email.trim() &&
      newTrainer.password.trim() &&
      newTrainer.age.trim() &&
      newTrainer.phone.trim() &&
      newTrainer.specialty.trim() &&
      newTrainer.availability.trim()
    ) {
      try {
        const trainerRef = await addDoc(collection(db, 'trainers'), {
          ...newTrainer,
        });
        setTrainers([...trainers, { id: trainerRef.id, ...newTrainer }]);
        setNewTrainer({ name: '', email: '', password: '', age: '', phone: '', specialty: '', availability: '' });
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error al agregar el entrenador:', error);
      }
    }
  };

  const handleDeleteTrainer = async (trainerId) => {
    try {
      await deleteDoc(doc(db, 'trainers', trainerId));
      setTrainers(trainers.filter((trainer) => trainer.id !== trainerId));
    } catch (error) {
      console.error('Error al eliminar el entrenador:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gestionar Entrenadores</Text>
      {trainers.map((trainer) => (
        <View key={trainer.id} style={styles.trainerCard}>
          <Text style={styles.trainerName}>{trainer.name}</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={() => handleDeleteTrainer(trainer.id)}>
              <Icon name="trash-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar Entrenador</Text>
      </TouchableOpacity>

      {/* Modal para añadir un nuevo entrenador */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Añadir Nuevo Entrenador</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newTrainer.name}
              onChangeText={(text) => setNewTrainer((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo Electrónico"
              value={newTrainer.email}
              onChangeText={(text) => setNewTrainer((prev) => ({ ...prev, email: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={newTrainer.password}
              onChangeText={(text) => setNewTrainer((prev) => ({ ...prev, password: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Edad"
              value={newTrainer.age}
              keyboardType="numeric"
              onChangeText={(text) => setNewTrainer((prev) => ({ ...prev, age: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={newTrainer.phone}
              keyboardType="phone-pad"
              onChangeText={(text) => setNewTrainer((prev) => ({ ...prev, phone: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Especialidad"
              value={newTrainer.specialty}
              onChangeText={(text) => setNewTrainer((prev) => ({ ...prev, specialty: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Disponibilidad (e.g., Lunes a Viernes, 9am - 6pm)"
              value={newTrainer.availability}
              onChangeText={(text) => setNewTrainer((prev) => ({ ...prev, availability: text }))}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleAddTrainer}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export { AdminDashboardScreen, ManageTrainersScreen };

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
  optionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: colors.primary,
  },
  trainerCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
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
  input: {
    borderWidth: 1,
    borderColor: colors.placeholder,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
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
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
