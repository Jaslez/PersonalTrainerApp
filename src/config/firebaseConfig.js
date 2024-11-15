// src/config/firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';  // Agrega getApps y getApp
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC0vLopEjtTtWAIzxIZRIlSk9eqKJ4AYhI',  // clave API de tu archivo
  authDomain: 'personal-trainer-app-56cd0.firebaseapp.com',  // Autenticación de dominio
  projectId: 'personal-trainer-app-56cd0',  // ID del proyecto
  storageBucket: 'personal-trainer-app-56cd0.appspot.com',  // Storage Bucket
  messagingSenderId: '62759644175',  // Número de proyecto
  appId: '1:62759644175:android:7d5e30c56162ce87f5c77a',  // App ID de tu archivo
};

// Inicializa Firebase solo si no ha sido inicializada antes
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa Firebase Auth con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Inicializa Firestore
const db = getFirestore(app);

// Exporta los servicios que se usarán en tu app
export { auth, db };
