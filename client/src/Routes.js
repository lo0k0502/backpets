import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import BottomNavigation from './components/Home/BottomNavigation';
import AllUsers from './components/DevOptions/AllUsers';
import AuthRoute from './components/Auth/AuthRoute';
import * as SecureStorage from 'expo-secure-store';
import { logoutUser, tokenRefresh } from './redux/userReducer';
import { unwrapResult } from '@reduxjs/toolkit';
import * as Location from 'expo-location';
import { Button, Text } from 'react-native-paper';
import { Restart } from 'fiction-expo-restart';
import AllImages from './components/DevOptions/AllImages';
import { useOnceUpdateEffect } from './hooks';

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

export default ({ signInStates: [signInState, setSignInState] }) => {
    const [errorMsg, setErrorMsg] = useState('');
    const [localState, setLocalState] = useState({});

    const dispatch = useDispatch();

    // Logout with alert
    const logout = () => {
        Alert.alert('正在登出', '確定要登出嗎?', [
            {
                text: '登出',
                onPress: async () => {
                    try {
                      const originalLocalState = JSON.parse(await SecureStorage.getItemAsync('localState'));
                      await SecureStorage.setItemAsync('localState', JSON.stringify({
                        ...originalLocalState,
                        rememberMe: 'unchecked',
                      }));
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
      let isMounted = true;

      (async () => {
        const originalLocalState = JSON.parse(await SecureStorage.getItemAsync('localState'));
        if (isMounted) setLocalState(originalLocalState);
      })();

      return () => { isMounted = false };
    }, []);

    useOnceUpdateEffect(() => {
      let isMounted = true;

      (async () => {
        if (localState === null) {
          await SecureStorage.setItemAsync('localState', JSON.stringify({
            rememberMe: 'unchecked',
            initialRoute: 'PostsRoute',
          }));
          if (isMounted) setLocalState({
            rememberMe: 'unchecked',
            initialRoute: 'PostsRoute',
          });
        }

        const afterLocalState = JSON.parse(await SecureStorage.getItemAsync('localState'));
        if (afterLocalState.rememberMe === 'unchecked') {
          console.log('Don\'t remember me!');
          if (isMounted) setSignInState(false);
          return;
        }

        const tokens = JSON.parse(await SecureStorage.getItemAsync('tokens'));
        if (tokens?.refreshToken) {
          try {
            if ((await Location.getForegroundPermissionsAsync()).status !== 'granted') {
              if ((await Location.requestForegroundPermissionsAsync()).status !== 'granted') {
                if (isMounted) setErrorMsg('權限不足!我們需要存取位置資訊來運行應用程式!');
                return;
              }
            }

            unwrapResult(await dispatch(tokenRefresh({ 
              refreshToken: tokens.refreshToken, 
            })));

            if (isMounted) setSignInState(true);
          } catch (error) {
            await SecureStorage.deleteItemAsync('tokens');
            if (isMounted) setSignInState(false);
            console.log('While refreshing:', error.message);
          }
        } else {
          if (isMounted) setSignInState(false);
        }
      })();

      return () => { isMounted = false };
    }, null, [localState]);

    return (
        <Stacks.Navigator screenOptions={{ headerShown: false }}>
        {
          signInState === null ? (
            <Stacks.Screen name='Splash'>
            {props => (
              <View {...props} style={ styles.view }>
                {
                  errorMsg ? (
                    <>
                      <Text style={{ color: 'red', fontWeight: 'bold', margin: 10 }}>{errorMsg}</Text>
                      <Text>請檢查您的權限設定並重新啟動應用程式</Text>
                      <Button onPress={() => Restart()}>
                        重新啟動
                      </Button>
                    </>
                  ) : (
                      <Image source={require('../assets/1647972285878.gif')} style={ styles.viewImage } />
                  )
                }
              </View>
            )}
            </Stacks.Screen>
          ) : signInState ? (
            <Stacks.Screen name='Main'>
            {props => <BottomNavigation {...props} logoutback={logout} />}
            </Stacks.Screen>
          ) : (
            <>
                <Stacks.Screen name='AuthRoute'>
                {props => <AuthRoute {...props} setSignInState={setSignInState} />}
                </Stacks.Screen>
                <Stacks.Screen name='AllUsers' options={{ headerShown: true }}>
                {props => <AllUsers {...props} />}
                </Stacks.Screen>
                <Stacks.Screen name='AllImages' options={{ headerShown: true }}>
                {props => <AllImages {...props} />}
                </Stacks.Screen>
            </>
          )
        }
        </Stacks.Navigator>
    );
};