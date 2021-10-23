import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import BottomNavigation from './components/Home/BottomNavigation';
import DeleteUser from './components/DevOptions/DeleteUser';
import AllUsers from './components/DevOptions/AllUsers';
import AuthRoute from './components/Auth/AuthRoute';
import * as SecureStorage from 'expo-secure-store';
import { tokenRefresh } from './redux/userReducer';
import { unwrapResult } from '@reduxjs/toolkit';

const styles = StyleSheet.create({
  view: { 
    flex: 1, 
    backgroundColor: 'white',
  },
  viewImage: { 
    width: '100%', 
    height: '100%',
  },
});

const Stacks = createStackNavigator();

export default () => {
    const [isSignin, setIsSignIn] = useState(null);// Controls what page should be displayed. null is splash page, false is login page, true is home page.
  
    const dispatch = useDispatch();
  
    // If local SecureStorage has token, try to refresh it.
    // If fail or has no token, display login page;
    // If refreshed, display home page.
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
            <View {...props} style={ styles.view }>
              <Image source={require('../assets/blackcat.png')} style={ styles.viewImage } />
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