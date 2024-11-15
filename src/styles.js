// src/styles.js

export const colors = {
    primary: '#34A853', // verde
    secondary: '#4285F4', // azul
    background: '#F2F2F2', // gris claro
    cardBackground: '#FFFFFF', // fondo para tarjetas
    text: '#333333', // color del texto principal
    placeholder: '#cccccc', // color del placeholder
  };
  
  export const globalStyles = {
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 20,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    input: {
      backgroundColor: colors.cardBackground,
      padding: 10,
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      color: colors.text,
    },
  };
  