import React from 'react';
import Home from "./components/Home";
import Map from "./components/Map";
import Chat from "./components/Chat";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Map" component={Map} />
        <Tab.Screen name="Chat" component={Chat} />
    </Tab.Navigator>
  )
}

export default BottomTabNavigator