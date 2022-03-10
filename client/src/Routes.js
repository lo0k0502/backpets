import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import DrawerContent from './components/drawer';
import BottomNavigation from './components/Home/BottomNavigation';
import DeleteUser from './components/DevOptions/DeleteUser';
import AllUsers from './components/DevOptions/AllUsers';
import AuthRoute from './components/Auth/AuthRoute';
import * as SecureStorage from 'expo-secure-store';
import { logoutUser, tokenRefresh } from './redux/userReducer';
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

const Drawer = createDrawerNavigator();
const Stacks = createStackNavigator();

export default ({ signInStates: [signInState, setSignInState] }) => {
    const [errorMsg, setErrorMsg] = useState('');
  
    const dispatch = useDispatch();
    
    // Logout with alert
    const logout = () => {
        Alert.alert('正在登出', '確定要登出嗎?', [
            { 
                text: '登出', 
                onPress: async () => {
                    try {
                        unwrapResult(await dispatch(logoutUser({})));
                        console.log('Not logged in, going back...');
                        setSignInState(false);
                    } catch (error) {
                        console.log('While logging out:', error);
                    }
                },
            },
            { text: '取消' },
        ]);
    };
  
    // If local SecureStorage has token, check for location permission and try to refresh it.
    // If failed or has no token, display login page;
    // If refreshed, display home page.
    useEffect(() => {
      (async () => {
        const tokens = JSON.parse(await SecureStorage.getItemAsync('tokens'));
        if (tokens?.refreshToken) {
          try {
            if ((await Location.getForegroundPermissionsAsync()).status !== 'granted') {
              if ((await Location.requestForegroundPermissionsAsync()).status !== 'granted') {
                setErrorMsg('權限不足!我們需要存取位置資訊來運行應用程式!');
                return;
              }
            }
            
            unwrapResult(await dispatch(tokenRefresh({ 
              refreshToken: tokens.refreshToken, 
            })));

            setSignInState(true);
          } catch (error) {
            setSignInState(false);
            console.log('While refreshing:', error.message);
          }
        } else setSignInState(false);
      })();
    }, []);

    return (
        <Stacks.Navigator screenOptions={{ headerShown: false }}>
        {signInState === null ? (
          <Stacks.Screen name='Splash'>
          {props => (
            <View {...props} style={ styles.view }>
              {errorMsg ? (
                <>
                  <Text style={{ color: 'red', fontWeight: 'bold', margin: 10 }}>{errorMsg}</Text>
                  <Text>請檢查您的權限設定並重新啟動應用程式</Text>
                  <Button onPress={() => Restart()}>
                    重新啟動
                  </Button>
                </>
              ) : (
                  <Image source={require('../assets/blackcat.png')} style={ styles.viewImage } />
              )}
            </View>
          )}
          </Stacks.Screen>
        ) : signInState ? (
          <Stacks.Screen name='Main'>
          {props => (
            <Drawer.Navigator
              {...props}
              drawerContent={props => <DrawerContent {...props} logoutback={logout} />} 
              screenOptions={{ headerShown: false }}
            >
              <Drawer.Screen name='BottomNavigation'>
              {props => <BottomNavigation {...props} />}
              </Drawer.Screen>
            </Drawer.Navigator>
          )}
          </Stacks.Screen>
        ) : (
          <>
              <Stacks.Screen name='AuthRoute'>
              {props => <AuthRoute {...props} setSignInState={setSignInState} />}
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