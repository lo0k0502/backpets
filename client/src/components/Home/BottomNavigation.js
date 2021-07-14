import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
        <Tabs.Navigator>
            <Tabs.Screen name='Home'>
                {props => <Home {...props} setUser={setUser} user={user} />}
            </Tabs.Screen>
            <Tabs.Screen name='Map'>
                {props => <Map {...props} />}
            </Tabs.Screen>
            <Tabs.Screen name='Store'>
                {props => <Store {...props} />}
            </Tabs.Screen>
        </Tabs.Navigator>
    );
};

export default BottomNavigation;