import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './theme';
import store from './src/redux/store';
import Routes from './src/Routes';
import './src/moment';

const styles = StyleSheet.create({
  safeAreaView: { 
    flex: 1, 
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
});

export default function App() {

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaView style={ styles.safeAreaView }>
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
      </PaperProvider>
    </Provider>
  );
}