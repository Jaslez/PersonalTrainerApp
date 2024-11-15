// src/screens/AdminDashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles, colors } from '../styles';

const AdminDashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel del Administrador Master</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TrainersManagementScreen')}>
        <Text style={styles.buttonText}>Gestionar Entrenadores</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AssignmentScreen')}>
        <Text style={styles.buttonText}>Asignar Alumnos a Entrenadores</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminDashboardScreen;

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
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
