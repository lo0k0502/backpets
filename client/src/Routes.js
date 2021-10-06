import React, { useEffect, useState } from 'react';
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
    const [isSignin, setIsSignIn] = useState(false);
  
    const dispatch = useDispatch();
  
    const check = async () => {
      const tokens = JSON.parse(await SecureStorage.getItemAsync('tokens'));
      if (tokens) {
        try {
          const result = unwrapResult(await dispatch(tokenRefresh({ 
            accessToken: tokens.accessToken, 
            refreshToken: tokens.refreshToken, 
          })));
          if (result) setIsSignIn(true);
        } catch (error) {
          setIsSignIn(false);
          console.log('While refreshing:', error.message);
        }
      } else setIsSignIn(false);
    };
  
    useEffect(() => {
      check();
    }), [];

    return (
        <Stacks.Navigator>
        {isSignin ? 
            <>
                <Stacks.Screen name='Home' options={{ headerShown: false }}>
                {props => <BottomNavigation {...props} setIsSignIn={setIsSignIn} />}
                </Stacks.Screen>
            </> : 
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
        }
        </Stacks.Navigator>
    );
};