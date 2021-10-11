import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import BottomNavigation from './components/Home/BottomNavigation';
import DeleteUser from './components/DevOptions/DeleteUser';
import AllUsers from './components/DevOptions/AllUsers';
import AuthRoute from './components/Auth/AuthRoute';
import * as SecureStorage from 'expo-secure-store';
import { tokenRefresh } from './redux/userReducer';
import { unwrapResult } from '@reduxjs/toolkit';

const Stacks = createStackNavigator();

export default () => {
    const [isSignin, setIsSignIn] = useState(null);
  
    const dispatch = useDispatch();
  
    useEffect(() => {
      (async () => {
        const tokens = JSON.parse(await SecureStorage.getItemAsync('tokens'));
        if (tokens?.refreshToken) {
          try {
            unwrapResult(await dispatch(tokenRefresh({ 
              refreshToken: tokens.refreshToken, 
            })));
            setIsSignIn(true);
          } catch (error) {
            setIsSignIn(false);
            console.log('While refreshing:', error.message);
          }
        } else setIsSignIn(false);
      })();
    }), [];

    return (
        <Stacks.Navigator>
        {isSignin === null ? (
          <Stacks.Screen name='Splash' options={{ headerShown: false }}>
          {props => (
            <View {...props} style={{ flex: 1, backgroundColor: 'white' }}>
              <Image source={require('../assets/blackcat.png')} style={{ width: '100%', height: '100%' }} />
            </View>
          )}
          </Stacks.Screen>
        ) : isSignin ? (
          <Stacks.Screen name='Home' options={{ headerShown: false }}>
          {props => <BottomNavigation {...props} setIsSignIn={setIsSignIn} />}
          </Stacks.Screen>
        ) : (
          <>
              <Stacks.Screen name='AuthRoute' options={{ headerShown: false }}>
              {props => <AuthRoute {...props} setIsSignIn={setIsSignIn} />}
              </Stacks.Screen>
              <Stacks.Screen name='DeleteUser'>
              {props => <DeleteUser {...props} />}
              </Stacks.Screen>
              <Stacks.Screen name='AllUsers'>
              {props => <AllUsers {...props} />}
              </Stacks.Screen>
          </>
        )}
        </Stacks.Navigator>
    );
};