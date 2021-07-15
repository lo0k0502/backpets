import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch } from 'react-redux';
import { setState } from '../../redux/userReducer';

import Home from './HomeRoute';
import Map from './MapRoute';
import Store from './StoreRoute';

const Tabs = createBottomTabNavigator();

const BottomNavigation = () => {
    const [user, setUser] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetch = async () => {
            const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
            setUser(userInfo);
            if (userInfo) dispatch(setState({ userInfo: userInfo.result, token: userInfo.token }));
        };
        fetch();
    }, []);

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
                name='Home' 
                options={{
                    tabBarIcon: ({ color, size }) => (
                      <Icons name='home' color={color} size={size} />
                    ),
                }}
            >
                {props => <Home {...props} setUser={setUser} user={user} />}
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