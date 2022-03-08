import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Appbar from '../../Appbar';
import Home from './HomeTab';
import Post from './Post';

const HomeStack = createStackNavigator();

export default () => {
    return (
        <HomeStack.Navigator
            screenOptions={{ 
                header: props => <Appbar {...props} />, 
                headerShown: true,
            }}
        >
            <HomeStack.Screen name='Home'>
            {props => <Home {...props} />}
            </HomeStack.Screen>
            <HomeStack.Screen 
                name='Post' 
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS
                }}
            >
            {props => <Post {...props} />}
            </HomeStack.Screen>
        </HomeStack.Navigator>
    );
};