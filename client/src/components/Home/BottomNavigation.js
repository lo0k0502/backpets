import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch } from 'react-redux';
import { tokenRefresh, setState } from '../../redux/userReducer';

import HomeRoute from './HomeRoute/HomeRoute';
import Map from './MapRoute';
import Store from './StoreRoute';

const Tabs = createBottomTabNavigator();

const BottomNavigation = ({ navigation }) => {
    const [user, setUser] = useState(null);

    const [checkSeconds, setCheckSeconds] = useState(0);
    const [refreshSeconds, setRefreshSeconds] = useState(0);

    useFocusEffect(useCallback(() => {
        let interval = null;
        interval = setInterval(() => {
            setCheckSeconds(checkSeconds === 1000 ? 0 : checkSeconds + 1);
        }, 1000);

        const check = async () => {
            if (!await AsyncStorage.getItem('userInfo')) {
                console.log('Unlogged in, going back...');
                navigation.goBack();
            }
        };
        
        check();
    
        return () => clearInterval(interval);
    }, [checkSeconds]));

    const dispatch = useDispatch();

    useEffect(() => {
        let interval = null;
        interval = setInterval(() => {
            setRefreshSeconds(refreshSeconds === 1000 ? 0 : refreshSeconds + 1);
        }, 60000);

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

        return () => clearInterval(interval);
    }, [refreshSeconds]);

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
                {props => <HomeRoute {...props} setUser={setUser} user={user} />}
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