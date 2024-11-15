import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import TrainerRoutineScreen from './TrainerRoutineScreen';
import TrainerInjuriesScreen from './TrainerInjuriesScreen';
import TrainerStudentDetailsScreen from './TrainerStudentDetailsScreen';
import { colors } from '../styles';

const Tab = createBottomTabNavigator();

const TrainerDashboardScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="ManageRoutines"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'TrainerRoutine') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'TrainerInjuries') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'TrainerStudentDetails') {
            iconName = focused ? 'people' : 'people-outline';
          }

          // Retornar el ícono apropiado para cada pestaña
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          elevation: 5,
        },
      })}
    >
    </Tab.Navigator>
  );
};

export default TrainerDashboardScreen;
