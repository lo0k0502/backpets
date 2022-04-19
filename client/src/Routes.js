import React, { memo, useEffect, useState } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import AllUsers from './components/DevOptions/AllUsers';
import AuthRoute from './components/Auth/AuthRoute';
import * as SecureStorage from 'expo-secure-store';
import { logoutUser, tokenRefresh } from './redux/userReducer';
import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Text } from 'react-native-paper';
import { Restart } from 'fiction-expo-restart';
import AllImages from './components/DevOptions/AllImages';
import { useOnceUpdateEffect } from './hooks';
import { askForLocationPermission, constants } from './utils';
import { initialContext } from './context';
import MainRoutes from './MainRoutes';

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

export default memo(({ signInStates: [signInState, setSignInState] }) => {
  const dispatch = useDispatch();

  const [errorMsg, setErrorMsg] = useState('');
  const [initialLocalState, setInitialLocalState] = useState({});

  // Logout with alert
  const logout = () => {
    Alert.alert('正在登出', '確定要登出嗎?', [
      { text: '取消' },
      {
        text: '登出',
        onPress: async () => {
          try {
            setSignInState(null);

            unwrapResult(await dispatch(logoutUser({})));

            const originalLocalState = JSON.parse(await SecureStorage.getItemAsync('localState'));
            await SecureStorage.setItemAsync('localState', JSON.stringify({
              ...originalLocalState,
              rememberMe: 'unchecked',
            }));
            setInitialLocalState({
              ...originalLocalState,
              rememberMe: 'unchecked',
            });

            console.log('Not logged in, going back...');
            setSignInState(false);
          } catch (error) {
              console.log('While logging out:', error);
          }
        },
      },
    ]);
  };

  // If local SecureStorage has token, check for location permission and try to refresh it.
  // If failed or has no token, display login page;
  // If refreshed, display home page.
  useEffect(() => {
    let isMounted = true;

    (async () => {
      const originalLocalState = JSON.parse(await SecureStorage.getItemAsync('localState'));
      const initialState = originalLocalState || {
        rememberMe: 'unchecked',
        initialRoute: constants.pageNames[2],
      };

      if (!originalLocalState) await SecureStorage.setItemAsync('localState', JSON.stringify(initialState));
      if (isMounted) setInitialLocalState(initialState);

      const tokens = JSON.parse(await SecureStorage.getItemAsync('tokens'));
      if (tokens?.refreshToken) {
        console.log('rememberMe: ', initialState.rememberMe);
        if (initialState.rememberMe === 'unchecked') {
          if (isMounted) setSignInState(false);
          return;
        }
  
        try {
          const granted = await askForLocationPermission();
          if (!granted) {
            if (isMounted) setErrorMsg('權限不足!我們需要存取位置資訊來運行應用程式!');
            return;
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
        if (initialState.rememberMe === 'checked') {
          const uncheckedState = {
            ...initialState,
            rememberMe: 'unchecked',
          };
          await SecureStorage.setItemAsync('localState', JSON.stringify(uncheckedState));
          if (isMounted) setInitialLocalState(uncheckedState);
        }
        if (isMounted) setSignInState(false);
      }
    })();

    return () => { isMounted = false };
  }, []);
  
  return (
    <initialContext.Provider
      value={{
        initialLocalState,
        logout,
        setSignInState,
      }}
    >
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
          <Stacks.Screen name='Main' component={MainRoutes} />
        ) : (
          <>
              <Stacks.Screen
                name='AuthRoute'
                component={AuthRoute}
              />
              <Stacks.Screen
                name='AllUsers'
                options={{ headerShown: true }}
                component={AllUsers}
              />
              <Stacks.Screen
                name='AllImages'
                options={{ headerShown: true }}
                component={AllImages}
              />
          </>
        )
      }
      </Stacks.Navigator>
    </initialContext.Provider>
  );
});