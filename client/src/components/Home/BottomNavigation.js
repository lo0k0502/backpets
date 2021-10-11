import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/userReducer';

import HomeRoute from './HomeRoute/HomeRoute';
import Map from './MapRoute';
import Store from './StoreRoute';
import { unwrapResult } from '@reduxjs/toolkit';

const Tabs = createMaterialBottomTabNavigator();

export default ({ navigation, setIsSignIn }) => {

    const dispatch = useDispatch();
    
    // Logout with alert
    const logout = () => {
        Alert.alert('Logging out', 'Are you sure you want to log out?', [
            { 
                text: 'Yes', 
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
            { text: 'No' },
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
                    bottom: 0,
                    borderRadius: 100,
                    overflow: 'hidden',
                }}
            >
                <Tabs.Screen 
                    name='HomeRoute' 
                    options={{
                        tabBarColor: '#ff8000',
                        tabBarIcon: ({ color }) => <Icons name='home' color={color} size={20} />,
                    }}
                >
                {props => <HomeRoute {...props} logoutback={logout} />}
                </Tabs.Screen>
                <Tabs.Screen 
                    name='Map'
                    options={{
                        tabBarColor: '#42f587',
                        tabBarIcon: ({ color }) => <Icons name='map' color={color} size={20} />,
                    }}
                >
                {props => <Map {...props} />}
                </Tabs.Screen>
                <Tabs.Screen 
                    name='Store'
                    options={{
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