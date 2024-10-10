import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkUserId(); // Verifique se há um userId salvo ao carregar o componente
  }, []);

  const saveUserId = async (id) => {
    try {
      await AsyncStorage.setItem('userId', id.toString());
      console.log('UserId saved successfully');
    } catch (error) {
      console.error('Error saving user ID:', error);
    }
  };

  const checkUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId !== null) {
        // userId encontrado no AsyncStorage, navegue para a tela Home
        navigation.navigate('Home');
      } else {
        console.log('UserId not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving user ID:', error);
    }
  };

  const handleLogin = () => {
    fetch('http://192.168.18.235:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then(async data => {
        console.log('Response data:', data);
        if (data.success) {
          await saveUserId(data.userId); // Salve o userId retornado pela API
          navigation.navigate('Home');
        } else {
          alert('Login failed: ' + (data.message || 'Unknown error'));
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('./../../assets/images/logosalon.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.appName}>Srb<Text style={styles.primaryText}>-Hair</Text> App</Text>
        <Text style={styles.description}>Find your favorite business near to your post you</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.btnText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.btnText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 150,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
  },
  primaryText: {
    color: Colors.primary,
  },
  description: {
    fontSize: 15,
    fontFamily: 'outfit',
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.grey,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: 'outfit',
  },
  loginBtn: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  registerBtn: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontFamily: 'outfit',
    fontSize: 16,
  },
});

export default LoginScreen;
