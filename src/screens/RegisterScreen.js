import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../components/CustomButton';
import { registerStudent } from '../services/authService';
import { globalStyles, colors } from '../styles';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Validaciones de campo
    if (!name || !email || !password || !age || !gender || !weight || !height) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (isNaN(age) || age <= 0) {
      setError('Edad debe ser un número positivo.');
      return;
    }
    if (isNaN(weight) || weight <= 0) {
      setError('Peso debe ser un número positivo.');
      return;
    }
    if (isNaN(height) || height <= 0) {
      setError('Altura debe ser un número positivo.');
      return;
    }

    // Si pasa las validaciones, intenta registrar
    try {
      await registerStudent(email, password, name, age, gender, weight, height);
      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error('Error al registrarse:', error);
      setError('Hubo un error en el registro. Intenta de nuevo.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={[globalStyles.title, styles.title]}>Regístrate</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={[globalStyles.input, styles.input]}
          placeholder="Nombre completo"
          placeholderTextColor={colors.placeholder}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError('');
          }}
        />
        <TextInput
          style={[globalStyles.input, styles.input]}
          placeholder="Correo electrónico"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
        />
        <TextInput
          style={[globalStyles.input, styles.input]}
          placeholder="Contraseña"
          placeholderTextColor={colors.placeholder}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
        />
        <TextInput
          style={[globalStyles.input, styles.input]}
          placeholder="Edad"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
          value={age}
          onChangeText={(text) => {
            setAge(text);
            setError('');
          }}
        />
        <Picker
          selectedValue={gender}
          style={styles.input}
          onValueChange={(itemValue) => {
            setGender(itemValue);
            setError('');
          }}
        >
          <Picker.Item label="Seleccione Género" value="" />
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Femenino" value="Femenino" />
        </Picker>
        <TextInput
          style={[globalStyles.input, styles.input]}
          placeholder="Peso (kg)"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
          value={weight}
          onChangeText={(text) => {
            setWeight(text);
            setError('');
          }}
        />
        <TextInput
          style={[globalStyles.input, styles.input]}
          placeholder="Altura (cm)"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
          value={height}
          onChangeText={(text) => {
            setHeight(text);
            setError('');
          }}
        />
        <CustomButton title="Registrarse" onPress={handleRegister} />
        <Text style={styles.signupText}>
          ¿Ya tienes una cuenta?{' '}
          <Text style={styles.signupLink} onPress={() => navigation.navigate('Login')}>
            Inicia sesión
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signupText: {
    color: '#fff',
    marginTop: 20,
  },
  signupLink: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
});
