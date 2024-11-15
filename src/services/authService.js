// src/services/authService.js
import { auth} from '../config/firebaseConfig';
import { createUserWithEmailAndPassword,  signInWithEmailAndPassword} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const registerStudent = async (email, password, name, age, gender, weight, height) => {
  try {
    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardar información adicional en Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      role: 'student',
      age,
      gender,
      weight,
      height,
    });

    console.log('Alumno registrado correctamente');
  } catch (error) {
    console.error('Error en el registro:', error);
  }
};


// Función para iniciar sesión del alumno
export const loginStudent = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Inicio de sesión exitoso:', user);
    return user;
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
};
