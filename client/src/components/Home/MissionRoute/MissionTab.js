import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MissionRoute from './Mission/MissionRoute';
import ReportRoute from './Report/ReportRoute';
import PutUpForAdoptionRoute from './PutUpForAdoption/PutUpForAdoptionRoute';
import { useTheme } from 'react-native-paper';

const MissionTab = createMaterialTopTabNavigator();

export default ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <MissionTab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: colors.primary } }}>
            <MissionTab.Screen name='Mission' options={{ title: '任務' }}>
            {props => <MissionRoute {...props} />}
            </MissionTab.Screen>
            <MissionTab.Screen name='Report' options={{ title: '通報' }}>
            {props => <ReportRoute {...props} />}
            </MissionTab.Screen>
            <MissionTab.Screen name='PutUpForAdoption' options={{ title: '認養' }}>
            {props => <PutUpForAdoptionRoute {...props} />}
            </MissionTab.Screen>
        </MissionTab.Navigator>
    );
};