import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home';
import UpdateProfile from './UpdateProfile';

const HomeStack = createStackNavigator();

const HomeRoute = ({ setUser, user }) => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name='Home' options={{ headerShown: false }}>
                {props => <Home {...props} setUser={setUser} user={user} />}
            </HomeStack.Screen>
            <HomeStack.Screen name='UpdateProfile'>
                {props => <UpdateProfile {...props} user={user} />}
            </HomeStack.Screen>
        </HomeStack.Navigator>
    );
};

export default HomeRoute;