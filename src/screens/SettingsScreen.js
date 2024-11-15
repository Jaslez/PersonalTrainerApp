import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { globalStyles, colors } from '../styles'; // Asegúrate de que estos estilos existan en tu proyecto
import { auth } from '../config/firebaseConfig';

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Función para alternar las notificaciones
  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    // Feedback visual al alternar
    Alert.alert(
      'Notificaciones',
      notificationsEnabled ? 'Notificaciones desactivadas' : 'Notificaciones activadas',
      [{ text: 'OK' }]
    );
  };

  // Función para cerrar sesión con confirmación
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: () => logout() },
      ]
    );
  };

  const logout = () => {
    auth.signOut()
      .then(() => {
        // Navega a la pantalla de inicio de sesión después de cerrar sesión
        navigation.replace('Login');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>

      {/* Sección Perfil */}
      <Text style={styles.sectionTitle}>Perfil</Text>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('EditProfile')}>
        <View style={styles.optionRow}>
          <Icon name="person-outline" size={24} color={colors.primary} />
          <Text style={styles.optionText}>Editar Perfil</Text>
        </View>
        <Icon name="chevron-forward-outline" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Sección Preferencias */}
      <Text style={styles.sectionTitle}>Preferencias</Text>
      <View style={styles.option}>
        <View style={styles.optionRow}>
          <Icon name="notifications-outline" size={24} color={colors.primary} />
          <Text style={styles.optionText}>Notificaciones</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          thumbColor={notificationsEnabled ? colors.primary : colors.text}
          trackColor={{ false: '#767577', true: colors.primary }}
        />
      </View>

      {/* Botón de Cerrar Sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

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
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.text,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBackground,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: colors.text,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#d9534f', // Rojo suave para indicar acción de riesgo
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
