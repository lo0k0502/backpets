import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { tokenRefresh, setState } from '../../redux/userReducer';

import HomeRoute from './HomeRoute/HomeRoute';
import Map from './MapRoute';
import Store from './StoreRoute';

const Tabs = createBottomTabNavigator();

const BottomNavigation = ({ navigation, setIsLogin, isLogin }) => {
    const [user, setUser] = useState(null);

    const [seconds, setSeconds] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetch = async () => {
            const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
            if (userInfo) {
                setUser(userInfo);
                dispatch(setState({ 
                    userInfo: userInfo.result, 
                    accessToken: userInfo.accessToken, 
                    refreshToken: userInfo.refreshToken,
                }));
                await dispatch(tokenRefresh({ 
                    accessToken: userInfo.accessToken, 
                    refreshToken: userInfo.refreshToken, 
                }));
            }
        };

        fetch();

        let interval = null;
        interval = setInterval(() => {
            setSeconds(seconds + 1);
        }, 60000);


        return () => clearInterval(interval);
    }, [seconds]);

    return (
        <Tabs.Navigator 
            tabBarOptions={{
                activeBackgroundColor: 'dodgerblue',
                activeTintColor: 'white',
                style: {
                    position: 'absolute',
                    right: 10,
                    left: 10,
                    bottom: 10,
                    borderRadius: 100,
                },
                tabStyle: {
                    borderRadius: 100,
                },
                labelStyle: {
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen 
                name='HomeRoute' 
                options={{
                    tabBarIcon: ({ color, size }) => (
                      <Icons name='home' color={color} size={size} />
                    ),
                }}
            >
                {props => <HomeRoute {...props} setUser={setUser} user={user} setIsLogin={setIsLogin} isLogin={isLogin} />}
            </Tabs.Screen>
            <Tabs.Screen 
                name='Map'
                options={{
                    tabBarIcon: ({ color, size }) => (
                      <Icons name='map' color={color} size={size} />
                    ),
                }}
            >
                {props => <Map {...props} />}
            </Tabs.Screen>
            <Tabs.Screen 
                name='Store'
                options={{
                    tabBarIcon: ({ color, size }) => (
                      <Icons name='store' color={color} size={size} />
                    ),
                }}
            >
                {props => <Store {...props} />}
            </Tabs.Screen>
        </Tabs.Navigator>
    );
};

export default BottomNavigation;