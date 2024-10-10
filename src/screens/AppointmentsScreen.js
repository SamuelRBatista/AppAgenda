import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppointmentsScreen = ({ navigation }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    } catch (error) {
      console.error('Error retrieving user ID:', error);
    }
  };

  const handleAddAppointment = async () => {
    if (userId && date && time && serviceType) {
      try {
        const response = await fetch('http://192.168.18.235:3000/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            date,
            time,
            service_type: serviceType,
          }),
        });
        const data = await response.json();
        console.log('Agendamento adicionado com sucesso:', data);
        setDate('');
        setTime('');
        setServiceType('');
      } catch (error) {
        console.error('Erro ao adicionar agendamento:', error);
      }
    } else {
      alert('Por favor, preencha todos os campos');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
    hideDatePicker();
  };

  const handleTimeConfirm = (selectedTime) => {
    if (selectedTime) {
      setTime(selectedTime.toLocaleTimeString().slice(0, 5));
    }
    hideTimePicker();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleServiceSelection = (selectedService) => {
    setServiceType(selectedService);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamentos</Text>

      <TouchableOpacity onPress={showDatePicker} style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Data"
          value={date}
          editable={false}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={showTimePicker} style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Hora"
          value={time}
          editable={false}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleModal} style={styles.inputWrapper}>
        <View style={styles.serviceInput}>
          <Text style={styles.serviceText}>{serviceType ? serviceType : 'Selecione o tipo de serviço'}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleAddAppointment}>
        <Text style={styles.btnText}>Adicionar Agendamento</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => handleServiceSelection('Corte')}>
              <Text style={styles.modalItem}>Corte</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleServiceSelection('Penteado')}>
              <Text style={styles.modalItem}>Penteado</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleServiceSelection('Hidratação')}>
              <Text style={styles.modalItem}>Hidratação</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleServiceSelection('Barba')}>
              <Text style={styles.modalItem}>Barba</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#333',
  },
  serviceInput: {
    height: 50,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  serviceText: {
    fontSize: 18,
    color: '#555',
  },
  btn: {
    backgroundColor: Colors.secondary,
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalItem: {
    fontSize: 18,
    paddingVertical: 15,
    color: '#333',
  },
});

export default AppointmentsScreen;
