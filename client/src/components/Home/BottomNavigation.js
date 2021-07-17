import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch } from 'react-redux';
import { tokenRefresh, setState, logoutUser } from '../../redux/userReducer';

import HomeRoute from './HomeRoute/HomeRoute';
import Map from './MapRoute';
import Store from './StoreRoute';

const Tabs = createBottomTabNavigator();

const BottomNavigation = ({ navigation }) => {

    const [refreshSeconds, setRefreshSeconds] = useState(0);

    const dispatch = useDispatch();

    useFocusEffect(useCallback(() => {
        navigation.addListener('beforeRemove', async e => {
            e.preventDefault();
            if (await AsyncStorage.getItem('userInfo')) logoutAlert()
                else navigation.dispatch(e.data.action);
        });
    }, [navigation]));

    const handleLogout = async () => {
        try {
            const { result: refreshToken } = JSON.parse(await AsyncStorage.getItem('userInfo'));
            await dispatch(logoutUser({ refreshToken }));
            checkLogin();
        } catch (error) {
            console.log(error);
        }
    };

    const logoutAlert = () => {
        Alert.alert('Logging out', 'Are you sure you want to log out?', [
            { text: 'Yes', onPress: handleLogout },
            { text: 'No' },
        ]);
    };
    
    const checkLogin = async () => {
        if (!await AsyncStorage.getItem('userInfo')) {
            console.log('Not logged in, going back...');
            navigation.popToTop();
        }
    };
    
    const fetch = async () => {
        const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));

        dispatch(setState({ 
            userInfo: userInfo.result, 
            accessToken: userInfo.accessToken, 
            refreshToken: userInfo.refreshToken,
        }));
        await dispatch(tokenRefresh({ 
            accessToken: userInfo.accessToken, 
            refreshToken: userInfo.refreshToken, 
        }));
    };
    
    let interval = null;
    useFocusEffect(useCallback(() => {
        interval = setInterval(() => {
            setRefreshSeconds(refreshSeconds === 1000 ? 0 : refreshSeconds + 1);
        }, 60000);

        checkLogin();
        fetch();

        return () => clearInterval(interval);
    }, [refreshSeconds]));

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
                {props => <HomeRoute {...props} logoutback={() => navigation.goBack()} />}
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