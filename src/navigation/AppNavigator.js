import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import AuthNavigator from './AuthNavigator';

// Importa tus pantallas
import DashboardScreen from '../screens/DashboardScreen';
import ProgressScreen from '../screens/ProgressScreen';
import RoutineScreen from '../screens/RoutineScreen';
import InjuriesScreen from '../screens/InjuriesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TrainerDashboardScreen from '../screens/TrainerDashboardScreen';
import TrainerRoutineScreen from '../screens/TrainerRoutineScreen';
import TrainerInjuryScreen from '../screens/TrainerInjuriesScreen';
import TrainerStudentDetailsScreen from '../screens/TrainerStudentDetailsScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ManageTrainersScreen from '../screens/ManageTrainersScreen';
import AssignStudentsScreen from '../screens/AssignStudentsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function StudentNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Inicio', tabBarIcon: ({ color, size }) => (<Icon name="home" size={size} color={color} />)}} />
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progreso', tabBarIcon: ({ color, size }) => (<Icon name="bar-chart" size={size} color={color} />)}} />
      <Tab.Screen name="Routine" component={RoutineScreen} options={{ title: 'Rutina', tabBarIcon: ({ color, size }) => (<Icon name="fitness" size={size} color={color} />)}} />
      <Tab.Screen name="Injuries" component={InjuriesScreen} options={{ title: 'Lesiones', tabBarIcon: ({ color, size }) => (<Icon name="medkit" size={size} color={color} />)}} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ajustes', tabBarIcon: ({ color, size }) => (<Icon name="settings" size={size} color={color} />)}} />
    </Tab.Navigator>
  );
}

function TrainerNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="TrainerDashboard" component={TrainerDashboardScreen} options={{ title: 'Entrenador', tabBarIcon: ({ color, size }) => (<Icon name="home" size={size} color={color} />)}} />
      <Tab.Screen name="TrainerRoutine" component={TrainerRoutineScreen} options={{ title: 'Rutinas', tabBarIcon: ({ color, size }) => (<Icon name="fitness" size={size} color={color} />)}} />
      <Tab.Screen name="TrainerInjuries" component={TrainerInjuryScreen} options={{ title: 'Lesiones', tabBarIcon: ({ color, size }) => (<Icon name="medkit" size={size} color={color} />)}} />
      <Tab.Screen name="TrainerStudentDetails" component={TrainerStudentDetailsScreen} options={{ title: 'Alumnos', tabBarIcon: ({ color, size }) => (<Icon name="people" size={size} color={color} />)}} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ajustes', tabBarIcon: ({ color, size }) => (<Icon name="settings" size={size} color={color} />)}} />
    </Tab.Navigator>
  );
}

function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="ManageTrainers" component={ManageTrainersScreen} options={{ title: 'Gestionar Entrenadores' }} />
      <Stack.Screen name="AssignStudents" component={AssignStudentsScreen} options={{ title: 'Asignar Alumnos' }} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setRole(userDocSnap.data().role);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // Pantalla de carga opcional

  return (
    <NavigationContainer>
      {user ? (
        role === 'adminmaster' ? (
          <AdminNavigator />
        ) : role === 'trainer' ? (
          <TrainerNavigator />
        ) : (
          <StudentNavigator />
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;
