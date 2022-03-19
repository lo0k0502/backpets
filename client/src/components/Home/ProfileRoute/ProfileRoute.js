import React, { useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Appbar from '../Appbar';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import Profile from './Profile';
import SelfMissions from './SelfMissions';
import Clue from './Clue';
import { useFocusEffect } from '@react-navigation/native';

const ProfileStack = createStackNavigator();

export default ({ route, navigation }) => {

    useFocusEffect(useCallback(() => {
      if (route.params?.to) {
        const { to, ...otherParams } = route.params;
        navigation.navigate(route.params.to, { ...otherParams });
      }
    }, [route.params]));

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