import React, { useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import Profile from './Profile';
import SelfMissions from './SelfMissions';
import { useFocusEffect } from '@react-navigation/native';
import PetPassports from './PetPassports';
import SelfClues from './SelfClues';
import PointRecord from './PointRecord';
import { Text } from 'react-native-paper';
import SelfPutUpForAdoptions from './SelfPutUpForAdoptions';
import AdoptionRecord from './AdoptionRecord';
import PutAdoptionRecord from './PutAdoptionRecord';
import Coupon from './Coupon';

const ProfileStack = createStackNavigator();

export default ({ route, navigation }) => {

    useFocusEffect(useCallback(() => {
      if (route.params?.to) {
        const { to, ...otherParams } = route.params;
        navigation.navigate(route.params.to, { ...otherParams });
      }
    }, [route.params]));

    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name='Profile' component={Profile} />
            <ProfileStack.Screen name='EditProfile' component={EditProfile} />
            <ProfileStack.Screen name='PetPassports' component={PetPassports} />
            <ProfileStack.Screen name='SelfMissions' component={SelfMissions} />
            <ProfileStack.Screen name='SelfPutUpForAdoptions' component={SelfPutUpForAdoptions} />
            <ProfileStack.Screen name='SelfClues' component={SelfClues} />
            <ProfileStack.Screen name='PutAdoptionRecord' component={PutAdoptionRecord} />
            <ProfileStack.Screen name='AdoptionRecord' component={AdoptionRecord} />
            <ProfileStack.Screen name='PointRecord' component={PointRecord} />
            <ProfileStack.Screen name='ChangePassword' component={ChangePassword} />
            <ProfileStack.Screen name='Coupon' component={Coupon} />
        </ProfileStack.Navigator>
    );
};