import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home';
import Profile from './Profile';
import ChangePassword from './ChangePassword';

const HomeStack = createStackNavigator();

const HomeRoute = ({ setUser, user, setIsLogin, isLogin }) => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name='Home' options={{ headerShown: false }}>
                {props => <Home {...props} setUser={setUser} user={user} setIsLogin={setIsLogin} isLogin={isLogin} />}
            </HomeStack.Screen>
            <HomeStack.Screen name='Profile'>
                {props => <Profile {...props} user={user} />}
            </HomeStack.Screen>
            <HomeStack.Screen name='ChangePassword'>
                {props => <ChangePassword {...props} user={user} />}
            </HomeStack.Screen>
        </HomeStack.Navigator>
    );
};

export default HomeRoute;