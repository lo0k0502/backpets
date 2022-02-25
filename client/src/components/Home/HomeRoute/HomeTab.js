import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MissionRoute from './Mission/MissionRoute';
import ReportRoute from './Report/ReportRoute';
import PutUpForAdoptionRoute from './PutUpForAdoption/PutUpForAdoptionRoute';

const HomeTab = createMaterialTopTabNavigator();

export default ({ navigation }) => {
    return (
        <HomeTab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: '#ff8000' } }}>
            <HomeTab.Screen name='Mission' options={{ title: '任務' }}>
            {props => <MissionRoute {...props} />}
            </HomeTab.Screen>
            <HomeTab.Screen name='Report' options={{ title: '通報' }}>
            {props => <ReportRoute {...props} />}
            </HomeTab.Screen>
            <HomeTab.Screen name='PutUpForAdoption' options={{ title: '認養' }}>
            {props => <PutUpForAdoptionRoute {...props} />}
            </HomeTab.Screen>
        </HomeTab.Navigator>
    );
};