import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './../src/screens/LoginScreen';
import RegisterScreen from './../src/screens/RegisterScreen';
import HomeScreen from './../src/screens/HomeScreen';
import AppointmentsScreen from './../src/screens/AppointmentsScreen';
import { AppointmentsProvider } from './../src/context/AppointmentsContext';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <AppointmentsProvider>
      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen}  />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} />    

      </Stack.Navigator>
      </AppointmentsProvider>
 
  );
}

export default App;
