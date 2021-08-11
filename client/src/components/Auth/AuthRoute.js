import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/core';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import Login from './Login';
import Register from './Register';
import { tokenRefresh } from '../../redux/userReducer';
import { setState } from '../../redux/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';

const AuhtStacks = createStackNavigator();
const Drawers = createDrawerNavigator();

const DevOptions = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button 
        mode='outlined' 
        icon='account-off'
        uppercase={false}
        onPress={() => navigation.navigate('DeleteUser')}
        style={{ margin: 10, }}
      >
        Delete User
      </Button>
      <Button 
        mode='outlined' 
        icon='account-multiple'
        uppercase={false}
        onPress={() => navigation.navigate('AllUsers')}
        style={{ margin: 10, }}
      >
        All Users
      </Button>
      <Button 
        mode='contained' 
        uppercase={false}
        onPress={() => navigation.goBack()}
        style={{ margin: 10, }}
      >
        Go Back
      </Button>
    </View>
  );
};

const LoginDrawer = ({ checkUnLogin, setIsSignIn }) => {
  return (
    <Drawers.Navigator>
      <Drawers.Screen name='Login'>
      {props => <Login {...props} checkUnLogin={checkUnLogin} setIsSignIn={setIsSignIn} />}
      </Drawers.Screen>
      <Drawers.Screen name='DevOptions'>
      {props => <DevOptions {...props} />}
      </Drawers.Screen>
    </Drawers.Navigator>
  );
};

const AuthRoute = ({ navigation, setIsSignIn }) => {

  return (
    <AuhtStacks.Navigator>
      <AuhtStacks.Screen name='Login'>
      {props => <LoginDrawer {...props} setIsSignIn={setIsSignIn} />}
      </AuhtStacks.Screen>
      <AuhtStacks.Screen name='Register'>
      {props => <Register {...props} />}
      </AuhtStacks.Screen>
    </AuhtStacks.Navigator>
  );
};

export default AuthRoute;