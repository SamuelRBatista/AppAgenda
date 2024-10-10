import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userAppointments, setUserAppointments] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário

  useEffect(() => {
    // Ao montar o componente, recupere o ID do usuário
    getLoggedUserId().then(id => setUserId(id));
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`http://192.168.18.235:3000/api/appointments/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserAppointments(Array.isArray(data) ? data : [data]);
        } else {
          console.error('Erro ao buscar agendamentos:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  const getLoggedUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId !== null) {
        return userId; // Retorna o ID do usuário recuperado
      }
    } catch (error) {
      console.error('Error retrieving user ID:', error);
    }
    return null; // Caso não encontre o ID do usuário
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
        if (response.ok) {
          fetchAppointments(); // Atualiza a lista de agendamentos após adicionar um novo
          setDate('');
          setTime('');
          setServiceType('');
        } else {
          console.error('Erro ao adicionar agendamento:', response.statusText);
        }
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
    const currentDate = selectedDate || date;
    setDate(currentDate.toLocaleDateString());
    hideDatePicker();
  };

  const handleTimeConfirm = (selectedTime) => {
    const currentTime = selectedTime.toLocaleTimeString().slice(0, 5);
    setTime(currentTime);
    hideTimePicker();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleServiceSelection = (selectedService) => {
    setServiceType(selectedService);
    toggleModal();
  };

  const renderAppointmentItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => console.log('Card pressed:', item)}>
      <Text style={styles.cardText}>Data: {item.date}</Text>
      <Text style={styles.cardText}>Hora: {item.time}</Text>
      <Text style={styles.cardText}>Serviço: {item.service_type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Agendamentos</Text>

      <TouchableOpacity onPress={showDatePicker} style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Data"
          value={date}
          editable={false}
        />
        <Ionicons name="calendar-outline" size={24} color={Colors.primary} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={showTimePicker} style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Hora"
          value={time}
          editable={false}
        />
        <Ionicons name="time-outline" size={24} color={Colors.primary} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleModal} style={styles.inputWrapper}>
        <View style={styles.serviceInput}>
          <Text style={styles.serviceText}>{serviceType ? serviceType : 'Selecione o tipo de serviço'}</Text>
          <Ionicons name="chevron-down-outline" size={24} color={Colors.primary} style={styles.icon} />
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

      <FlatList
        data={userAppointments}
        keyExtractor={(item, index) => (item && item._id) ? item._id.toString() : index.toString()}
        renderItem={renderAppointmentItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius:9, 
    paddingHorizontal: 1,
    elevation: 3,
  },
  input: {
    height: 40,
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  serviceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius:9, 
    height: 40,
    width: '100%', 
    backgroundColor: '#fff',  
    paddingHorizontal:5,
    justifyContent: 'space-between',
    elevation: 2,
  },
  serviceText: {  
    fontSize: 16,
    color: Colors.primary,
  },
  btn: {
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'outfit',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  modalItem: {
    fontSize: 18,
    paddingVertical: 10,
  },
  listContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default HomeScreen;
