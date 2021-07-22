import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home';
import Profile from './Profile';
import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';

const HomeStack = createStackNavigator();

const HomeRoute = ({ logoutback, fetch }) => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name='Home' options={{ headerShown: false }}>
            {props => <Home {...props} logoutback={logoutback} fetch={fetch} />}
            </HomeStack.Screen>
            <HomeStack.Screen name='Profile'>
            {props => <Profile {...props} />}
            </HomeStack.Screen>
            <HomeStack.Screen name='EditProfile' options={{ title:'Edit Profile' }}>
            {props => <EditProfile {...props} />}
            </HomeStack.Screen>
            <HomeStack.Screen name='ChangePassword' options={{ title: 'Change Password' }}>
            {props => <ChangePassword {...props} />}
            </HomeStack.Screen>
        </HomeStack.Navigator>
    );
};

export default HomeRoute;