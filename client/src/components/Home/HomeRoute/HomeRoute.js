import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home';
import Profile from './Profile';
import ChangePassword from './ChangePassword';

const HomeStack = createStackNavigator();

const HomeRoute = ({ logoutback }) => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name='Home' options={{ headerShown: false }}>
                {props => <Home {...props} logoutback={logoutback} />}
            </HomeStack.Screen>
            <HomeStack.Screen name='Profile'>
                {props => <Profile {...props} />}
            </HomeStack.Screen>
            <HomeStack.Screen name='ChangePassword'>
                {props => <ChangePassword {...props} />}
            </HomeStack.Screen>
        </HomeStack.Navigator>
    );
};

export default HomeRoute;