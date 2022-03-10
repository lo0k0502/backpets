import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { SafeAreaView, Platform, Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './theme';
import store from './src/redux/store';
import Routes from './src/Routes';
import './src/moment';

export default function App() {
  const [signInState, setSignInState] = useState(null);// Controls what page should be displayed. null is splash page, false is login page, true is home page.

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaView 
          style={{ 
            flex: 1,
            backgroundColor: '#f0e5da',
            paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
          }}
        >
          <StatusBar 
            style='auto'
            backgroundColor={signInState === false ? '#f0e5da' : Appearance.getColorScheme() === 'dark' ? theme.colors.primary : 'white'}
            animated
            networkActivityIndicatorVisible
            translucent
          />
          <NavigationContainer>
            <Routes signInStates={[signInState, setSignInState]} />
          </NavigationContainer>
        </SafeAreaView>
      </PaperProvider>
    </Provider>
  );
}