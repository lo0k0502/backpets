import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Route from './src/Route';

export default function App() {

  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 35 : 0 }}>
        <StatusBar 
          style='auto' 
          backgroundColor='white' 
          animated
          networkActivityIndicatorVisible
          translucent
        />
        <NavigationContainer>
          <Route />
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}