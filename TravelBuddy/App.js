import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Animated, Button } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./components/Home";
import Map from "./components/Map";
import Chat from './components/Chat';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen
          name='Home'
          component={Home}
        />
        <Stack.Screen 
          name='Map'
          component={Map}  
        />
        <Stack.Screen 
          name='Chat'
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ) 
};
