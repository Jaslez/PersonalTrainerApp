import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { globalStyles, colors } from '../styles';

const InjuriesScreen = () => {
  const [injuries, setInjuries] = useState([]); // Inicialmente vacío
  const [selectedInjury, setSelectedInjury] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleInjurySelect = (injury) => {
    setSelectedInjury(injury);
    setIsModalVisible(true);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const updatedInjuries = injuries.map((injury) => {
        if (injury.id === selectedInjury.id) {
          return {
            ...injury,
            comments: [...injury.comments, newComment],
          };
        }
        return injury;
      });

      setInjuries(updatedInjuries);
      setNewComment('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lesiones Registradas</Text>
      {injuries.length === 0 ? (
        <Text style={styles.noInjuriesText}>No hay lesiones registradas aún.</Text>
      ) : (
        injuries.map((injury) => (
          <TouchableOpacity
            key={injury.id}
            style={styles.injuryCard}
            onPress={() => handleInjurySelect(injury)}
          >
            <Text style={styles.injuryName}>{injury.name}</Text>
            <Icon name="information-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        ))
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedInjury?.name}</Text>
            <Text style={styles.modalDescription}>{selectedInjury?.description}</Text>

            <View style={styles.commentsSection}>
              <Text style={styles.subtitle}>Comentarios:</Text>
              {selectedInjury?.comments.length > 0 ? (
                selectedInjury.comments.map((comment, index) => (
                  <Text key={index} style={styles.commentText}>- {comment}</Text>
                ))
              ) : (
                <Text style={styles.noCommentsText}>No hay comentarios aún.</Text>
              )}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Añadir un comentario"
              placeholderTextColor={colors.placeholder}
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddComment}
            >
              <Text style={styles.addButtonText}>Añadir Comentario</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

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
  injuryCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  injuryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  noInjuriesText: {
    fontSize: 16,
    color: colors.placeholder,
    textAlign: 'center',
    marginVertical: 20,
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
  modalDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  commentsSection: {
    alignSelf: 'stretch',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  commentText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  noCommentsText: {
    fontSize: 16,
    color: colors.placeholder,
  },
  input: {
    ...globalStyles.input,
    marginBottom: 10,
    width: '100%',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default InjuriesScreen;
