import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/userReducer';

import HomeRoute from './HomeRoute/HomeRoute';
import Map from './MapRoute/MapRoute';
import Store from './StoreRoute';
import { unwrapResult } from '@reduxjs/toolkit';

const Tabs = createMaterialBottomTabNavigator();

export default ({ setIsSignIn }) => {

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
                        setIsSignIn(false);
                    } catch (error) {
                        console.log('While logging out:', error);
                    }
                },
            },
            { text: '取消' },
        ]);
    };

    return (
        <Provider>
            <Tabs.Navigator 
                shifting
                style={{
                }}
                barStyle={{
                    position: 'absolute',
                    right: 10,
                    left: 10,
                    bottom: 5,
                    borderRadius: 100,
                    overflow: 'hidden',
                }}
            >
                <Tabs.Screen 
                    name='Map'
                    options={{
                        title: '地圖',
                        tabBarColor: '#42f587',
                        tabBarIcon: ({ color }) => <Icons name='map' color={color} size={20} />,
                    }}
                >
                {props => <Map {...props} />}
                </Tabs.Screen>
                <Tabs.Screen 
                    name='HomeRoute' 
                    options={{
                        title: '首頁',
                        tabBarColor: '#ff8000',
                        tabBarIcon: ({ color }) => <Icons name='home' color={color} size={20} />,
                    }}
                >
                {props => <HomeRoute {...props} logoutback={logout} />}
                </Tabs.Screen>
                <Tabs.Screen 
                    name='Store'
                    options={{
                        title: '商店',
                        tabBarColor: 'dodgerblue',
                        tabBarIcon: ({ color }) => <Icons name='store' color={color} size={20} />,
                    }}
                >
                {props => <Store {...props} />}
                </Tabs.Screen>
            </Tabs.Navigator>
        </Provider>
    );
};