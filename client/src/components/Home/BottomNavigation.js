import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/userReducer';

import HomeRoute from './HomeRoute/HomeRoute';
import Map from './MapRoute';
import Store from './StoreRoute';
import { unwrapResult } from '@reduxjs/toolkit';

const Tabs = createBottomTabNavigator();

export default ({ navigation, setIsSignIn }) => {

    const dispatch = useDispatch();
    
    const handleLogout = async () => {
        try {
            unwrapResult(await dispatch(logoutUser({})));
            console.log('Not logged in, going back...');
            setIsSignIn(false);
        } catch (error) {
            console.log('While logging out:', error);
        }
    };
    
    const logoutAlert = () => {
        Alert.alert('Logging out', 'Are you sure you want to log out?', [
            { text: 'Yes', onPress: handleLogout },
            { text: 'No' },
        ]);
    };

    return (
        <Provider>
            <Tabs.Navigator 
                tabBarOptions={{
                    activeBackgroundColor: 'dodgerblue',
                    activeTintColor: 'white',
                    style: {
                        position: 'absolute',
                        right: 10,
                        left: 10,
                        bottom: 0,
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
                {props => <HomeRoute {...props} logoutback={logoutAlert} />}
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
        </Provider>
    );
};