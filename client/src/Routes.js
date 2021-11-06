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
import * as Location from 'expo-location';
import { Button, Text } from 'react-native-paper';
import { Restart } from 'fiction-expo-restart';

const styles = StyleSheet.create({
  view: { 
    flex: 1, 
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewImage: { 
    width: '100%', 
    height: '100%',
  },
});

const Stacks = createStackNavigator();

export default () => {
    const [isSignin, setIsSignIn] = useState(null);// Controls what page should be displayed. null is splash page, false is login page, true is home page.
    const [errorMsg, setErrorMsg] = useState('');
  
    const dispatch = useDispatch();
  
    // If local SecureStorage has token, try to refresh it.
    // If fail or has no token, display login page;
    // If refreshed, display home page.
    useEffect(() => {
      (async () => {
        const tokens = JSON.parse(await SecureStorage.getItemAsync('tokens'));
        if (tokens?.refreshToken) {
          try {
            if ((await Location.getForegroundPermissionsAsync()).status !== 'granted') {
              if ((await Location.requestForegroundPermissionsAsync()).status !== 'granted') {
                setErrorMsg('We need your location permission to load the app!');
                return;
              }
            }
            
            unwrapResult(await dispatch(tokenRefresh({ 
              refreshToken: tokens.refreshToken, 
            })));

            console.log('Already logged in, going to Home...');
            setIsSignIn(true);
          } catch (error) {
            setIsSignIn(false);
            console.log('While refreshing:', error.message);
          }
        } else setIsSignIn(false);
      })();
    }, []);

    return (
        <Stacks.Navigator screenOptions={{ headerShown: false }}>
        {isSignin === null ? (
          <Stacks.Screen name='Splash'>
          {props => (
            <View {...props} style={ styles.view }>
              {errorMsg ? (
                <>
                  <Text style={{ color: 'red', fontWeight: 'bold', margin: 10 }}>{errorMsg}</Text>
                  <Text>Please check your settings and reload the app</Text>
                  <Button onPress={() => Restart()}>
                    Reload App
                  </Button>
                </>
              ) : (
                  <Image source={require('../assets/blackcat.png')} style={ styles.viewImage } />
              )}
            </View>
          )}
          </Stacks.Screen>
        ) : isSignin ? (
          <Stacks.Screen name='Main'>
          {props => <BottomNavigation {...props} setIsSignIn={setIsSignIn} />}
          </Stacks.Screen>
        ) : (
          <>
              <Stacks.Screen name='AuthRoute'>
              {props => <AuthRoute {...props} setIsSignIn={setIsSignIn} />}
              </Stacks.Screen>
              <Stacks.Screen name='DeleteUser' options={{ headerShown: true }}>
              {props => <DeleteUser {...props} />}
              </Stacks.Screen>
              <Stacks.Screen name='AllUsers' options={{ headerShown: true }}>
              {props => <AllUsers {...props} />}
              </Stacks.Screen>
          </>
        )}
        </Stacks.Navigator>
    );
};