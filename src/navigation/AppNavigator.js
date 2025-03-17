import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import ClipsListScreen from '../screens/ClipsListScreen';
import ClipPlayerScreen from '../screens/ClipPlayerScreen';
import DownloadsScreen from '../screens/DownloadsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom dark theme
const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00AAFF',
    background: '#121212',
    card: '#1A1A1A',
    text: 'white',
    border: '#333333',
  },
};

// Home stack
const HomeStack = () => (
  <Stack.Navigator 
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1A1A1A',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: 'white',
    }}
  >
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="ClipsList" 
      component={ClipsListScreen}
      options={({ route }) => ({ title: `${route.params.channelName}'s Clips` })}
    />
    <Stack.Screen 
      name="ClipPlayer" 
      component={ClipPlayerScreen}
      options={{ title: 'Playing Clip' }}
    />
  </Stack.Navigator>
);

// Downloads stack
const DownloadsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1A1A1A',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: 'white',
    }}
  >
    <Stack.Screen 
      name="Downloads" 
      component={DownloadsScreen}
      options={{ title: 'My Downloads' }}
    />
    <Stack.Screen 
      name="ClipPlayer" 
      component={ClipPlayerScreen}
      options={{ title: 'Playing Clip' }}
    />
  </Stack.Navigator>
);

// Main app navigator with tabs
const AppNavigator = () => (
  <NavigationContainer theme={DarkTheme}>
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopColor: '#333333',
        },
        tabBarActiveTintColor: '#00AAFF',
        tabBarInactiveTintColor: '#888888',
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={24} />
          )
        }}
      />
      <Tab.Screen 
        name="DownloadsTab" 
        component={DownloadsStack} 
        options={{
          tabBarLabel: 'Downloads',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="file-download" color={color} size={24} />
          )
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigator;