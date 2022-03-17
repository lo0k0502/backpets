import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Appbar from '../Appbar';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import Profile from './Profile';
import SelfMissions from './SelfMissions';
import Clue from './Clue';

const ProfileStack = createStackNavigator();

export default () => {
    return (
        <ProfileStack.Navigator
            screenOptions={{
                header: props => <Appbar {...props} />, 
                headerShown: true,
            }}
        >
            <ProfileStack.Screen name='Profile' options={{ headerShown: false }}>
            {props => <Profile {...props} />}
            </ProfileStack.Screen>
            <ProfileStack.Screen name='EditProfile'>
            {props => <EditProfile {...props} />}
            </ProfileStack.Screen>
            <ProfileStack.Screen name='ChangePassword'>
            {props => <ChangePassword {...props} />}
            </ProfileStack.Screen>
            <ProfileStack.Screen name='SelfMissions'>
            {props => <SelfMissions {...props} />}
            </ProfileStack.Screen>
            <ProfileStack.Screen name='Clue'>
            {props => <Clue {...props} />}
            </ProfileStack.Screen>
        </ProfileStack.Navigator>
    );
};