import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './src/redux/store';

import BottomNavigation from './src/components/Home/BottomNavigation';
import DeleteUser from './src/components/DevOptions/DeleteUser';
import AllUsers from './src/components/DevOptions/AllUsers';
import AuthRoute from './src/components/Auth/AuthRoute';

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

  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar 
          style='auto' 
          backgroundColor='white' 
          animated
          networkActivityIndicatorVisible
          translucent
        />
        <NavigationContainer>
          <Stacks.Navigator>
            <Stacks.Screen name='AuthRoute' options={{ headerShown: false }}>
            {props => <AuthRoute {...props} />}
            </Stacks.Screen>
            <Stacks.Screen name='DeleteUser'>
            {props => <DeleteUser {...props} />}
            </Stacks.Screen>
            <Stacks.Screen name='Home' options={{ headerShown: false }}>
            {props => <BottomNavigation {...props} />}
            </Stacks.Screen>
            <Stacks.Screen name='AllUsers'>
            {props => <AllUsers {...props} />}
            </Stacks.Screen>
          </Stacks.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}