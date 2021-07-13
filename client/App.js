import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Platform, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './src/components/Login';
import BottomNavigation from './src/components/BottomNavigation';
import Register from './src/components/Register';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  statusbar: {
    flex: 1,
  },
});

const Stacks = createStackNavigator();

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        style='auto' 
        backgroundColor='white' 
        animated
        networkActivityIndicatorVisible
        translucent
      />
      <NavigationContainer>
        <Stacks.Navigator initialRouteName={isLogin ? 'Home' : 'Login'}>
          <Stacks.Screen name='Login' component={Login} />
          <Stacks.Screen name='Register' component={Register} />
          <Stacks.Screen name='Home' component={BottomNavigation} />
        </Stacks.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}