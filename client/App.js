import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Routes from './src/Routes';
import { injectStore } from './src/api/API';

injectStore(store);

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
          <Routes />
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}