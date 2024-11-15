import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground } from 'react-native';
import CustomButton from '../components/CustomButton';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebaseConfig';
import { globalStyles, colors } from '../styles';
import { doc, getDoc } from 'firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    try {
      // Autenticar al usuario
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener el documento del usuario desde Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        // Redirigir al usuario según su rol
        if (userData.role === 'adminmaster') {
          navigation.replace('AdminMasterDashboardScreen');
        } else if (userData.role === 'trainer') {
          // Comprobar si es el primer inicio de sesión
          if (user.metadata.creationTime === user.metadata.lastSignInTime) {
            navigation.replace('ChangePasswordScreen', { userId: user.uid });
          } else {
            navigation.replace('TrainerDashboardScreen');
          }
        } else if (userData.role === 'student') {
          navigation.replace('DashboardScreen');
        } else {
          setError('Rol no reconocido, contacte con el soporte.');
        }
      } else {
        setError('No se pudo obtener la información del usuario.');
      }
    } catch (error) {
      // Manejo de errores de inicio de sesión
      if (error.code === 'auth/user-not-found') {
        setError('Usuario no registrado. Por favor, regístrate.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta. Intenta de nuevo.');
      } else {
        setError('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={[globalStyles.title, styles.title]}>Iniciar Sesión</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
        <CustomButton title="Ingresar" onPress={handleLogin} />
        <Text style={styles.signupText}>
          ¿No tienes una cuenta?{' '}
          <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>
            Regístrate
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

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
  },
  signupText: {
    color: '#fff',
    marginTop: 20,
  },
  signupLink: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
});
