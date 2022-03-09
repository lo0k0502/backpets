import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import Appbar from '../../Appbar';
import MissionTab from './MissionTab';
import Post from './Post';

const MissionStack = createStackNavigator();

export default () => {
    return (
        <MissionStack.Navigator
            screenOptions={{ 
                header: props => <Appbar {...props} />, 
                headerShown: true,
            }}
        >
            <MissionStack.Screen name='MissionTab'>
            {props => <MissionTab {...props} />}
            </MissionStack.Screen>
            <MissionStack.Screen 
                name='Post' 
                options={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS
                }}
            >
            {props => <Post {...props} />}
            </MissionStack.Screen>
        </MissionStack.Navigator>
    );
};