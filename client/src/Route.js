import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import BottomNavigation from './components/Home/BottomNavigation';
import DeleteUser from './components/DevOptions/DeleteUser';
import AllUsers from './components/DevOptions/AllUsers';
import AuthRoute from './components/Auth/AuthRoute';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenRefresh } from './redux/userReducer';

const Stacks = createStackNavigator();

export default () => {
    const [isSignin, setIsSignIn] = useState(false);
  
    const dispatch = useDispatch();
  
    const check = async () => {
      const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
      if (userInfo) {
        try {
          await dispatch(tokenRefresh({ 
            accessToken: userInfo.accessToken, 
            refreshToken: userInfo.refreshToken, 
          }));
          setIsSignIn(true);
        } catch (error) {
          setIsSignIn(false);
          console.log(error.message);
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